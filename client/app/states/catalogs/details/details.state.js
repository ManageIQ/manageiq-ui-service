import templateUrl from './details.html'
// import { Promise } from 'q'

/** @ngInject */
export function CatalogsDetailsState (routerHelper) {
  routerHelper.configureStates(getStates())
}

function getStates () {
  return {
    'catalogs.details': {
      url: '/:serviceTemplateId',
      templateUrl,
      controller: Controller,
      controllerAs: 'vm',
      title: __('Service Template Details')
    },
    'orders.duplicate': {
      url: '/duplicate/:serviceRequestId',
      templateUrl,
      controller: Controller,
      controllerAs: 'vm',
      title: __('Duplicate Service')
    }
  }
}

/** @ngInject */
function Controller ($stateParams, CollectionsApi, EventNotifications, ShoppingCart, DialogFieldRefresh, lodash) {
  const vm = this

  let dialogs = {}

  function init () {
    vm.loading = true
    vm.addToCart = addToCart
    vm.cartAllowed = ShoppingCart.allowed
    vm.addToCartEnabled = false
    vm.alreadyInCart = alreadyInCart
    vm.addToCartDisabled = addToCartDisabled
    vm.refreshField = refreshField
    vm.setDialogData = setDialogData
    vm.serviceRequest = {}
    vm.serviceTemplateRequest = serviceTemplateRequest
    vm.emptyDialogRequest = emptyDialogRequest
    vm.serviceRequestDialogs = []
    vm.initializedDialogs = []
    vm.dialogsCount = 0

    vm.dynamicFieldsSummary = {}

    vm.dialogsContent = []
    vm.dialogData = {}
    vm.dialogUrl = ''
    vm.setDialogUrl = setDialogUrl

    vm.breadcrumb = {
      'url': 'catalogs',
      'title': __('Service Catalogs')
    }

    serviceRequestPromise().then((resolvedServiceRequest) => {
      initDialogs(resolvedServiceRequest)
    })
  }

  init()

  function initDialogs (resolvedServiceRequest) {
    vm.serviceRequest = resolvedServiceRequest
    const allPromises = [vm.emptyDialogRequest(), vm.serviceTemplateRequest()]

    Promise.all(allPromises).then((data) => {
      const SERVICE_TEMPLATE_RESPONSE = 1
      const DIALOGS_RESPONSE = 0
      dialogs = data[DIALOGS_RESPONSE]
      vm.serviceTemplate = data[SERVICE_TEMPLATE_RESPONSE]
      vm.serviceTemplate.long_description = parseDescription(vm.serviceTemplate)
      setDialogUrl()

      if (dialogs.subcount > 0) {
        if (vm.serviceRequest) {
          const existingDialogValues = vm.serviceRequest.options.dialog
          dialogs.resources[0].content.forEach((dialog) => {
            vm.serviceRequestDialogs.push(DialogFieldRefresh.setFieldValueDefaults(dialog, existingDialogValues))
          })
          vm.parsedDialogs = vm.serviceRequestDialogs
        } else {
          vm.dialogsCount = dialogs.resources[0].content.length
          dialogs.resources[0].content.forEach((dialog) => {
            initDialogFields(dialog)
          })
        }
      }
    })
  }

  // recursive function
  function initDialogFields (dialog) {
    updateDynamicFieldsSummary(dialog)

    Promise.all(initDynamicDialogFields(dialog)).then((dynamicFieldsData) => {
      setDialogFields(dialog, dynamicFieldsData)

      if (vm.dynamicFieldsSummary[dialog.id].allFieldResponders.length > 0) {
        initDialogFields(dialog)
      } else {
        vm.initializedDialogs.push(dialog)

        if (vm.initializedDialogs.length === vm.dialogsCount) {
          vm.parsedDialogs = vm.initializedDialogs
          vm.loading = false
        }
      }
    })
  }

  function updateDynamicFieldsSummary (dialog) {
    if (!vm.dynamicFieldsSummary.hasOwnProperty(dialog.id)) {
      initDynamicFieldsSummary(dialog)
    } else {
      updateAllFieldResponders(dialog)
    }
  }

  function initDynamicFieldsSummary (dialog) {
    vm.dynamicFieldsSummary[dialog.id] = {}
    vm.dynamicFieldsSummary[dialog.id].allDynamicFieldsToInit = {}
    vm.dynamicFieldsSummary[dialog.id].allFieldResponders = []

    dialog.dialog_tabs.forEach((dialogTab, tabIndex) => {
      dialogTab.dialog_groups.forEach((dialogGroup, groupIndex) => {
        dialogGroup.dialog_fields.forEach((dialogField, fieldIndex) => {
          if (dialogField.dynamic) {
            vm.dynamicFieldsSummary[dialog.id].allDynamicFieldsToInit[dialogField.name] = {
              tabIndex: tabIndex,
              groupIndex: groupIndex,
              fieldIndex: fieldIndex,
              data: dialogField
            }

            vm.dynamicFieldsSummary[dialog.id].allFieldResponders = lodash.uniq(
              vm.dynamicFieldsSummary[dialog.id].allFieldResponders.concat(dialogField.dialog_field_responders)
            )
          } else {
            vm.dialogData[dialogField.name] = dialogField.default_value
          }
        })
      })
    })
  }

  function updateAllFieldResponders (dialog) {
    vm.dynamicFieldsSummary[dialog.id].allFieldResponders = []

    const allDynamicFieldsToInit = vm.dynamicFieldsSummary[dialog.id].allDynamicFieldsToInit

    for (let fieldName in allDynamicFieldsToInit) {
      vm.dynamicFieldsSummary[dialog.id].allFieldResponders = lodash.uniq(
        vm.dynamicFieldsSummary[dialog.id].allFieldResponders.concat(allDynamicFieldsToInit[fieldName].data.dialog_field_responders)
      )
    }
  }

  // returns Array of Promise
  function initDynamicDialogFields (dialog) {
    let allRefreshFieldPromises = []

    const allDynamicFieldsToInit = vm.dynamicFieldsSummary[dialog.id].allDynamicFieldsToInit
    const allFieldResponders = vm.dynamicFieldsSummary[dialog.id].allFieldResponders

    for (let fieldName in allDynamicFieldsToInit) {
      if (!allFieldResponders.includes(fieldName)) {
        allRefreshFieldPromises.push(refreshField(allDynamicFieldsToInit[fieldName].data, dialog.id))
      }
    }

    return allRefreshFieldPromises
  }

  function setDialogFields (dialog, dialogFieldsData) {
    dialogFieldsData.forEach((dialogFieldData) => {
      let dynamicFieldInfo = vm.dynamicFieldsSummary[dialog.id].allDynamicFieldsToInit[dialogFieldData.name]

      dialog
        .dialog_tabs[dynamicFieldInfo.tabIndex]
        .dialog_groups[dynamicFieldInfo.groupIndex]
        .dialog_fields[dynamicFieldInfo.fieldIndex] = dialogFieldData

      vm.dialogData[dialogFieldData.name] = dialogFieldData.default_value

      delete vm.dynamicFieldsSummary[dialog.id].allDynamicFieldsToInit[dialogFieldData.name]
    })
  }

  function serviceRequestPromise () {
    return new Promise((resolve, reject) => {
      if ($stateParams.serviceRequestId) {
        vm.breadcrumb = {
          'url': 'orders',
          'title': __('My Orders')
        }

        CollectionsApi.get('requests', $stateParams.serviceRequestId, {}).then((data) => { resolve(data) })
      } else {
        resolve(false)
      }
    })
  }

  function emptyDialogRequest () {
    return new Promise((resolve, reject) => {
      const options = {
        expand: 'resources',
        attributes: 'content',
        custom_param: 'empty_dialog'
      }
      let serviceTemplateId = $stateParams.serviceTemplateId
      if (!serviceTemplateId) {
        serviceTemplateId = vm.serviceRequest.source_id
      }
      CollectionsApi.query('service_templates/' + serviceTemplateId + '/service_dialogs', options).then((resolvedDialogs) => {
        dialogs = resolvedDialogs
        resolve(resolvedDialogs)
      })
    })
  }

  function serviceTemplateRequest () {
    return new Promise((resolve, reject) => {
      let serviceTemplateId = $stateParams.serviceTemplateId
      if (!serviceTemplateId) {
        serviceTemplateId = vm.serviceRequest.source_id
      }
      var options = { expand: 'resources', attributes: ['picture', 'resource_actions', 'picture.image_href'] }
      CollectionsApi.get('service_templates', serviceTemplateId, options).then((data) => {
        resolve(data)
      })
    })
  }

  function setDialogUrl () {
    vm.dialogUrl = `service_dialogs`

    return vm.dialogUrl
  }
  /**
 * This function triggers a refresh of a single dialog field
 * @function refreshField
 * @param  {object} field, dialogId
 * @returns {Promise}
 */
  function refreshField (field, dialogId = null) {
    const resourceActions = vm.serviceTemplate.resource_actions
    let resourceActionId = lodash.find(resourceActions, ['action', 'Provision']).id

    if (dialogId == null) {
      dialogId = vm.parsedDialogs[0].id
    }

    let idList = {
      dialogId: dialogId,
      resourceActionId: resourceActionId,
      targetId: vm.serviceTemplate.id,
      targetType: 'service_template'
    }
    const url = `${vm.dialogUrl}`
    return DialogFieldRefresh.refreshDialogField(vm.dialogData, [field.name], url, idList)
  }
  /**
   * Stores resulting data output from a dialog
   * @function setDialogData
   * @param  {object} data
  */
  function setDialogData (data) {
    vm.addToCartEnabled = data.validations.isValid
    vm.dialogData = data.data
  }
  /**
   * Determines whether a user can add to cart
   * @function addToCartDisabled
   * @returns {boolean}
  */
  function addToCartDisabled () {
    return (!vm.cartAllowed() || !vm.addToCartEnabled)
  }

  /**
   * Prepares data from dialog to be submitted
   * @function dataForSubmit
   * @param {string} href
   * @returns {object}
  */
  function dataForSubmit (href) {
    var dialogFieldData = {}
    dialogFieldData[href] = '/api/service_templates/' + vm.serviceTemplate.id

    return lodash.merge(vm.dialogData, dialogFieldData)
  }
  /**
   * Checks to see if a user is submitting a duplicate request
   * @function alreadyInCart
   * @returns {boolean}
  */
  function alreadyInCart () {
    return ShoppingCart.isDuplicate(dataForSubmit('service_template_href'))
  }

  /**
   * Adds service to cart
   * @function addToCart
  */
  function addToCart () {
    if (!ShoppingCart.allowed()) {
      return
    }

    var dialogFieldData = dataForSubmit('service_template_href')

    vm.addingToCart = true

    return ShoppingCart.add({
      description: vm.serviceTemplate.name,
      data: dialogFieldData
    })
      .then(addSuccess, addFailure)
      .then(function () {
        vm.addingToCart = false
      })

    function addSuccess (result) {
      if (result.duplicate) {
        EventNotifications.success(__("Item added to shopping cart, but it's a duplicate of an existing item"))
      } else {
        EventNotifications.success(__('Item added to shopping cart'))
      }
    }

    function addFailure (result) {
      var errors = result.split(',')
      for (var i = 0; i < errors.length; ++i) {
        EventNotifications.error(__('There was an error adding to shopping cart: ') + errors[i])
      }
    }
  }
}

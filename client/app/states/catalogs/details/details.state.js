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
function Controller ($stateParams, CollectionsApi, EventNotifications, ShoppingCart, DialogFieldRefresh, lodash, DialogData) {
  const vm = this

  let dialogs = {}
  let serviceRequest = {}

  function init () {
    vm.loading = true
    vm.addToCart = addToCart
    vm.cartAllowed = ShoppingCart.allowed
    vm.addToCartEnabled = false
    vm.alreadyInCart = alreadyInCart
    vm.addToCartDisabled = addToCartDisabled
    vm.refreshField = refreshField
    vm.setDialogData = setDialogData
    vm.dialogData = {}
    vm.dialogUrl = ''
    vm.setDialogUrl = setDialogUrl
    vm.breadcrumb = {
      'url': 'catalogs',
      'title': __('Service Catalogs')
    }

    const serviceRequestPromise = () => {
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
    serviceRequestPromise().then((resolvedServiceRequest) => {
      serviceRequest = resolvedServiceRequest

      const dialogRequest = new Promise((resolve, reject) => {
        const options = { expand: 'resources', attributes: 'content' }
        let serviceTemplateId = $stateParams.serviceTemplateId
        if (!serviceTemplateId) {
          serviceTemplateId = serviceRequest.source_id
        }
        CollectionsApi.query('service_templates/' + serviceTemplateId + '/service_dialogs', options).then((resolvedDialogs) => {
          dialogs = resolvedDialogs
          resolve(resolvedDialogs)
        })
      })

      const serviceTemplateRequest = new Promise((resolve, reject) => {
        let serviceTemplateId = $stateParams.serviceTemplateId
        if (!serviceTemplateId) {
          serviceTemplateId = serviceRequest.source_id
        }
        var options = { expand: 'resources', attributes: ['picture', 'resource_actions', 'picture.image_href'] }
        CollectionsApi.get('service_templates', serviceTemplateId, options).then((data) => {
          resolve(data)
        })
      })
      const allPromises = [dialogRequest, serviceTemplateRequest]
      Promise.all(allPromises).then((data) => {
        const SERVICE_TEMPLATE_RESPONSE = 1
        const DIALOGS_RESPONSE = 0
        dialogs = data[DIALOGS_RESPONSE]
        vm.serviceTemplate = data[SERVICE_TEMPLATE_RESPONSE]
        vm.parsedDialogs = []

        if (dialogs.subcount > 0) {
          if (serviceRequest) {
            const existingDialogValues = serviceRequest.options.dialog
            dialogs.resources[0].content.forEach((dialog) => {
              vm.parsedDialogs.push(DialogFieldRefresh.setFieldValueDefaults(dialog, existingDialogValues))
            })
          } else {
            vm.parsedDialogs = dialogs.resources[0].content
          }
        }
        setDialogUrl()
        vm.loading = false
      })
    })
  }

  init()
  function setDialogUrl () {
    vm.dialogUrl = `service_dialogs`

    return vm.dialogUrl
  }
  /**
 * This function triggers a refresh of a single dialog field
 * @function refreshField
 * @param  {object} field
 * @returns {Promise}
 */
  function refreshField (field) {
    const resourceActions = vm.serviceTemplate.resource_actions
    let resourceActionId = lodash.find(resourceActions, ['action', 'Provision']).id

    let idList = {
      dialogId: vm.parsedDialogs[0].id,
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
    var dialogData = DialogData.outputConversion(vm.dialogData);
    dialogData[href] = '/api/service_templates/' + vm.serviceTemplate.id;
    return dialogData;
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

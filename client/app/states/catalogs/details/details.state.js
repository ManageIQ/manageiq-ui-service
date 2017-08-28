import templateUrl from './details.html'

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
      title: __('Service Template Details'),
      resolve: {
        dialogs: resolveDialogs,
        serviceTemplate: resolveServiceTemplate
      }
    }
  }
}

/** @ngInject */
/**
 * This function handles REST request for service templates
 * @function resolveServiceTemplate
 * @param  {object} $stateParams
 * @param  {object} CollectionsApi
 */
function resolveServiceTemplate ($stateParams, CollectionsApi) {
  var options = {attributes: ['picture', 'picture.image_href']}

  return CollectionsApi.get('service_templates', $stateParams.serviceTemplateId, options)
}

/**
 * Handles querying for dialog data
 * @function resolveDialogs
 * @param  {object} $stateParams
 * @param  {object} CollectionsApi
 */
/** @ngInject */
function resolveDialogs ($stateParams, CollectionsApi) {
  var options = {expand: 'resources', attributes: 'content'}

  return CollectionsApi.query('service_templates/' + $stateParams.serviceTemplateId + '/service_dialogs', options)
}

/** @ngInject */
function Controller (dialogs, serviceTemplate, EventNotifications, ShoppingCart, DialogFieldRefresh, lodash) {
  var vm = this

  vm.serviceTemplate = serviceTemplate

  if (dialogs.subcount > 0) {
    vm.dialogs = dialogs.resources[0].content
  }

  vm.addToCart = addToCart
  vm.cartAllowed = ShoppingCart.allowed
  vm.addToCartEnabled = false
  vm.alreadyInCart = alreadyInCart
  vm.addToCartDisabled = addToCartDisabled
  vm.refreshField = refreshField
  vm.setDialogData = setDialogData
  vm.dialogData = {}

  vm.dialogUrl = 'service_catalogs/' + serviceTemplate.service_template_catalog_id + '/service_templates'

  /**
 * This function triggers a refresh of a single dialog field
 * @function refreshField
 * @param  {object} field
 * @returns {Promise}
 */
  function refreshField (field) {
    return DialogFieldRefresh.refreshDialogField(vm.dialogData, [field.name], vm.dialogUrl, vm.serviceTemplate.id)
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
    dialogFieldData[href] = '/api/service_templates/' + serviceTemplate.id

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

/* eslint camelcase: "off" */
import template from './reconfigure.html';

/** @ngInject */
export function ServicesReconfigureState (routerHelper) {
  routerHelper.configureStates(getStates())
}

function getStates () {
  return {
    'services.reconfigure': {
      url: '/:serviceId',
      template,
      controller: StateController,
      controllerAs: 'vm',
      title: __('Service Details')
    }
  }
}

/** @ngInject */
function StateController ($state, $stateParams, CollectionsApi, EventNotifications, DialogFieldRefresh, DialogData) {
  const vm = this

  vm.title = __('Service Details')
  vm.service = {}
  vm.serviceId = $stateParams.serviceId
  vm.submitDialog = submitDialog
  vm.cancelDialog = cancelDialog
  vm.backToService = backToService
  vm.refreshField = refreshField
  vm.setDialogData = setDialogData
  vm.dialogData = {}
  vm.loading = true

  function init () {
    var requestAttributes = [
      'provision_dialog'
    ]
    var options = { attributes: requestAttributes }
    CollectionsApi.get('services', $stateParams.serviceId, options).then((response) => {
      vm.loading = false
      vm.service = response
      vm.dialogUrl = `services/${vm.service.service_template_catalog_id}/service_templates`
      vm.dialogs = [setFieldValueDefaults(vm.service.provision_dialog)]
    })
  }
  init()
  function refreshField (field) {
    return DialogFieldRefresh.refreshDialogField(vm.dialogData, [field.name], vm.dialogUrl, vm.serviceId)
  }

  function setFieldValueDefaults (dialog) {
    if (angular.isDefined(vm.service.options)) {
      dialog = DialogFieldRefresh.setFieldValueDefaults(dialog, vm.service.options)
    }

    return dialog
  }
  function setDialogData (data) {
    vm.dialogData = data.data
  }
  function submitDialog () {
    vm.dialogData.href = `/api/services/${vm.serviceId}`

    let apiData = {
      action: 'reconfigure',
      resource: DialogData.outputConversion(vm.dialogData),
    };

    CollectionsApi.post('services', $stateParams.serviceId, {}, angular.toJson(apiData))
      .then(submitSuccess, submitFailure);

    function submitSuccess (result) {
      EventNotifications.success(result.message)
      $state.go('services.details', {serviceId: vm.serviceId})
    }

    function submitFailure (result) {
      EventNotifications.error(__('There was an error submitting this request: ') + result)
    }
  }

  function cancelDialog () {
    EventNotifications.success(__('Reconfigure this service has been cancelled'))
    $state.go('services.details', {serviceId: vm.serviceId})
  }

  function backToService () {
    $state.go('services.details', {serviceId: vm.serviceId})
  }
}

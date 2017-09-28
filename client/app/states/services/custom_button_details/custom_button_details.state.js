import templateUrl from './custom_button_details.html'

/** @ngInject */
export function CustomButtonDetailsState (routerHelper) {
  routerHelper.configureStates(getStates())
}

function getStates () {
  return {
    'services.custom_button_details': {
      url: '/:serviceId/custom_button_details',
      templateUrl,
      controller: StateController,
      controllerAs: 'vm',
      title: __('Custom Button Details'),
      params: {
        button: {
          value: null
        },
        serviceId: {
          value: null
        },
        vmId: {
          value: null
        }
      },
      resolve: {
        dialog: resolveDialog,
        service: resolveService
      }
    }
  }
}

/** @ngInject */
function resolveService ($stateParams, CollectionsApi) {
  var options = {attributes: ['picture', 'picture.image_href']}

  return CollectionsApi.get('services', $stateParams.serviceId, options)
}

/** @ngInject */
function resolveDialog ($stateParams, CollectionsApi) {
  const options = {expand: 'resources', attributes: 'content'}
  const dialogId = $stateParams.button.resource_action.dialog_id

  return CollectionsApi.query('service_dialogs/' + dialogId, options)
}

/** @ngInject */
function StateController ($state, $stateParams, dialog, service, CollectionsApi, EventNotifications, DialogFieldRefresh) {
  var vm = this
  vm.title = __('Custom button action')
  vm.dialogs = dialog.content
  vm.service = service
  vm.serviceId = $stateParams.serviceId
  vm.vmId = $stateParams.vmId || null
  vm.button = $stateParams.button
  vm.submitCustomButton = submitCustomButton
  vm.submitButtonEnabled = false
  vm.dialogUrl = 'service_dialogs/'
  vm.refreshField = refreshField
  vm.setDialogData = setDialogData
  vm.dialogData = {}

  function refreshField (field) {
    return DialogFieldRefresh.refreshDialogField(vm.dialogData, [field.name], vm.dialogUrl, dialog.id)
  }

  function setDialogData (data) {
    vm.submitButtonEnabled = data.validations.isValid
    vm.dialogData = data.data
  }

  function submitCustomButton () {
    let collection = 'services'
    let itemId = vm.serviceId

    if (vm.vmId) {
      collection = 'vms'
      itemId = vm.vmId
    }

    CollectionsApi.post(
      collection,
      itemId,
      {},
      angular.toJson({action: $stateParams.button.name, resource: vm.dialogData})
    ).then(submitSuccess, submitFailure)

    function submitSuccess (result) {
      EventNotifications.success(result.message)
      let stateName = 'services.details'
      let parameters = {serviceId: vm.serviceId}

      if (vm.vmId) {
        stateName = 'services.resource-details'
        parameters = {serviceId: vm.serviceId, vmId: vm.vmId}
      }
      $state.go(stateName, parameters)
    }

    function submitFailure (result) {
      EventNotifications.error(__('There was an error submitting this request: ') + result.data.error.message)
    }
  }
}

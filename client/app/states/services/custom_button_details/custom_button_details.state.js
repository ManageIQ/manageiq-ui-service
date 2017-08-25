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
      title: __('Service Custom Button Details'),
      params: {
        button: {
          value: null
        },
        serviceId: {
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
    const buttonClass = vm.button.applies_to_class.toLowerCase()
    const collection = buttonClass === 'servicetemplate' ? 'services' : buttonClass === 'vm' ? 'vms' : null

    CollectionsApi.post(
      collection,
      $stateParams.serviceId,
      {},
      angular.toJson({action: $stateParams.button.name, resource: vm.dialogData})
    ).then(submitSuccess, submitFailure)

    function submitSuccess (result) {
      EventNotifications.success(result.message)
      $state.go('services.details', {serviceId: $stateParams.serviceId})
    }

    function submitFailure (result) {
      EventNotifications.error(__('There was an error submitting this request: ') + result.data.error.message)
    }
  }
}

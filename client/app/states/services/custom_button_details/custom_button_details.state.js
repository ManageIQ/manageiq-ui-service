import template from './custom_button_details.html';

/** @ngInject */
export function CustomButtonDetailsState (routerHelper) {
  routerHelper.configureStates(getStates())
}

function getStates () {
  return {
    'services.custom_button_details': {
      url: '/:serviceId/custom_button_details',
      template,
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
      }
    }
  }
}

/** @ngInject */
function StateController ($state, $stateParams, CollectionsApi, EventNotifications, DialogFieldRefresh, DialogData) {
  const vm = this
  vm.title = __('Custom button action')
  vm.dialogId = $stateParams.dialogId || ''
  vm.dialogs = {}
  vm.service = {}
  vm.serviceId = $stateParams.serviceId
  vm.vmId = $stateParams.vmId || null
  vm.button = $stateParams.button
  vm.resourceAction = vm.button.resource_action
  vm.submitCustomButton = submitCustomButton
  vm.submitButtonEnabled = false
  vm.dialogUrl = 'service_dialogs'
  vm.refreshField = refreshField
  vm.setDialogData = setDialogData
  vm.dialogData = {}
  vm.loading = true

  function init () {
    const options = {
      expand: 'resources',
      attributes: 'content',
      resource_action_id: vm.resourceAction.id,
      target_id: vm.serviceId,
      target_type: 'service'
    }
    if (vm.vmId) {
      options.target_type = 'vm'
      options.target_id = vm.vmId
    }

    const dialogId = vm.resourceAction.dialog_id
    const resolveDialogs = CollectionsApi.query(`service_dialogs/${dialogId}`, options)
    const resolveService = CollectionsApi.get('services', $stateParams.serviceId, {attributes: ['picture', 'picture.image_href']})

    Promise.all([resolveDialogs, resolveService]).then((data) => {
      const SERVICE_RESPONSE = 1
      const DIALOGS_RESPONSE = 0
      vm.dialogId = data[DIALOGS_RESPONSE].id
      vm.dialogs = data[DIALOGS_RESPONSE].content
      vm.service = data[SERVICE_RESPONSE]
      vm.loading = false
    })
  }
  init()
  function refreshField (field) {
    let targetType = 'service'
    let targetId = vm.serviceId
    if (vm.vmId) {
      targetType = 'vm'
      targetId = vm.vmId
    }

    let idList = {
      dialogId: vm.dialogId,
      resourceActionId: vm.resourceAction.id,
      targetId: targetId,
      targetType: targetType
    }

    return DialogFieldRefresh.refreshDialogField(vm.dialogData, [field.name], vm.dialogUrl, idList)
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

    let apiData = {
      action: $stateParams.button.name,
      resource: DialogData.outputConversion(vm.dialogData),
    };

    CollectionsApi.post(collection, itemId, {}, angular.toJson(apiData))
      .then(submitSuccess, submitFailure);

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

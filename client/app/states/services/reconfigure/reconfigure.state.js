/* eslint camelcase: "off" */
import templateUrl from './reconfigure.html'

/** @ngInject */
export function ServicesReconfigureState (routerHelper) {
  routerHelper.configureStates(getStates())
}

function getStates () {
  return {
    'services.reconfigure': {
      url: '/:serviceId',
      templateUrl,
      controller: StateController,
      controllerAs: 'vm',
      title: __('Service Details'),
      resolve: {
        service: resolveService
      }
    }
  }
}

/** @ngInject */
function resolveService ($stateParams, CollectionsApi) {
  var requestAttributes = [
    'provision_dialog'
  ]
  var options = {attributes: requestAttributes}

  return CollectionsApi.get('services', $stateParams.serviceId, options)
}

/** @ngInject */
function StateController ($state, $stateParams, CollectionsApi, service, EventNotifications, DialogFieldRefresh) {
  var vm = this

  vm.title = __('Service Details')
  vm.service = service
  vm.dialogs = [setFieldValueDefaults(vm.service.provision_dialog)]
  vm.submitDialog = submitDialog
  vm.cancelDialog = cancelDialog
  vm.backToService = backToService
  vm.dialogUrl = 'services/' + vm.service.service_template_catalog_id + '/service_templates'
  vm.refreshField = refreshField
  vm.setDialogData = setDialogData
  vm.dialogData = {}

  function refreshField (field) {
    return DialogFieldRefresh.refreshDialogField(vm.dialogData, [field.name], vm.dialogUrl, vm.service.id)
  }

  function setFieldValueDefaults (dialog) {
    const fieldValues = {}
    if (angular.isDefined(vm.service.options)) {
      for (var option in vm.service.options.dialog) {
        fieldValues[option.replace('dialog_', '')] = vm.service.options.dialog[option]
      }
      // Just for user reference for dialog heirarchy dialog => tabs => groups => fields => field
      dialog.dialog_tabs.forEach((tab, tab_index) => {
        tab.dialog_groups.forEach((group, group_index) => {
          group.dialog_fields.forEach((field, field_index) => {
            const fieldValue = (angular.isDefined(fieldValues[field.name]) ? fieldValues[field.name] : field.default_value)
            dialog.dialog_tabs[tab_index].dialog_groups[group_index].dialog_fields[field_index].default_value = fieldValue
          })
        })
      })
    }

    return dialog
  }
  function setDialogData (data) {
    vm.dialogData = data.data
  }
  function submitDialog () {
    vm.dialogData.href = '/api/services/' + service.id

    CollectionsApi.post(
      'services',
      $stateParams.serviceId,
      {},
      angular.toJson({action: 'reconfigure', resource: vm.dialogData})
    ).then(submitSuccess, submitFailure)

    function submitSuccess (result) {
      EventNotifications.success(result.message)
      $state.go('services.details', {serviceId: $stateParams.serviceId})
    }

    function submitFailure (result) {
      EventNotifications.error(__('There was an error submitting this request: ') + result)
    }
  }

  function cancelDialog () {
    EventNotifications.success(__('Reconfigure this service has been cancelled'))
    $state.go('services.details', {serviceId: $stateParams.serviceId})
  }

  function backToService () {
    $state.go('services.details', {serviceId: service.id})
  }
}

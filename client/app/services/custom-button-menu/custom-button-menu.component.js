import './_custom-button-menu.sass'
import templateUrl from './custom-button-menu.html'

export const CustomButtonMenuComponent = {
  bindings: {
    customActions: '<',
    serviceId: '<',
    vmId: '<'
  },
  controller: CustomButtonMenuController,
  controllerAs: 'vm',
  templateUrl
}

/** @ngInject */
function CustomButtonMenuController ($state, EventNotifications, CollectionsApi, RBAC) {
  const vm = this
  vm.hasRequiredRole = hasRequiredRole
  vm.invokeCustomAction = invokeCustomAction
  function hasRequiredRole (button) {
    const acceptableRoles = button.visibility.roles

    return RBAC.hasRole(...acceptableRoles)
  }

  function invokeCustomAction (button) {
    if (button.enabled) {
      if (button.resource_action && button.resource_action.dialog_id) {
        const options = {
          button: button,
          serviceId: vm.serviceId
        }
        if (vm.vmId) {
          options.vmId = vm.vmId
        }
        $state.go('services.custom_button_details', options)
      } else if (vm.vmId) {
        const data = { action: button.name }
        CollectionsApi.post('vms', vm.vmId, {}, data)
          .then(postSuccess)
          .catch(postFailure)
      } else {
        const data = { action: button.name }
        CollectionsApi.post('services', vm.serviceId, {}, data)
          .then(postSuccess)
          .catch(postFailure)
      }
    }

    function postSuccess (response) {
      if (response.success === false) {
        EventNotifications.error(response.message)
      } else {
        EventNotifications.success(response.message)
      }
    }

    function postFailure (response) {
      EventNotifications.error(__('There was an error submitting the custom button. ') + response.message)
    }
  }
}

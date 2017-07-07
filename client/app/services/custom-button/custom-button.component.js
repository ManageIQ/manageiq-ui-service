import './_custom-button.sass';
import templateUrl from './custom-button.html';

export const CustomButtonComponent = {
  bindings: {
    customActions: '<',
    serviceId: '<',
    vmId: '<',
  },
  controller: CustomButtonController,
  controllerAs: 'vm',
  templateUrl,
};

/** @ngInject */
function CustomButtonController($state, EventNotifications, CollectionsApi, RBAC) {
  const vm = this;

  vm.hasRequiredRole = hasRequiredRole;
  vm.invokeCustomAction = invokeCustomAction;

  function hasRequiredRole(button) {
    const acceptableRoles = button.visibility.roles;

    return RBAC.hasRole(...acceptableRoles);
  }

  function invokeCustomAction(button) {
    if (button.resource_action && button.resource_action.dialog_id) {
      $state.go('services.custom_button_details', {
        button: button,
        serviceId: vm.serviceId,
      });
    } else if (vm.vmId) { 
      const data = {action: button.name};
      CollectionsApi.post('vms', vm.vmId, {}, data)
        .then(postSuccess)
        .catch(postFailure);
    } else {
      const data = {action: button.name};
      CollectionsApi.post('services', vm.serviceId, {}, data)
        .then(postSuccess)
        .catch(postFailure);
    }

    function postSuccess(response) {
      if (response.success === false) {
        EventNotifications.error(response.message);
      } else {
        EventNotifications.success(response.message);
      }
    }

    function postFailure() {
      EventNotifications.error(__('Action not able to submit.'));
    }
  }
}

/* eslint-disable semi, space-before-function-paren, comma-dangle */

/** @ngInject */
export function VmPowerFactory(CollectionsApi, EventNotifications, sprintf) {
  return {
    can: {
      start(vm) {
        return vm.power_state !== 'on';
      },

      stop(vm) {
        return vm.power_state === 'on';
      },

      suspend(vm) {
        return vm.power_state === 'on';
      },

      retire(vm) {
        // TODO
      },
    },

    do: {
      start(vm) {
        vm.power_state = '';
        vm.power_status = 'starting';
        vm.normalized_state = 'unknown';

        return CollectionsApi.post('vms', vm.id, {}, { action: 'start' })
          .then(actionSuccess(sprintf(__('%s was started.'), vm.name)))
          .catch(actionFailure(__('There was an error starting this virtual machine.')));
      },

      stop(vm) {
        vm.power_state = '';
        vm.power_status = 'stopping';
        vm.normalized_state = 'unknown';

        return CollectionsApi.post('vms', vm.id, {}, { action: 'stop' })
          .then(actionSuccess(sprintf(__('%s was stopped.'), vm.name)))
          .catch(actionFailure(__('There was an error stopping this virtual machine.')));
      },

      suspend(vm) {
        vm.power_state = '';
        vm.power_status = 'suspending';
        vm.normalized_state = 'unknown';

        return CollectionsApi.post('vms', vm.id, {}, { action: 'suspend' })
          .then(actionSuccess(sprintf(__('%s was suspended.'), vm.name)))
          .catch(actionFailure(__('There was an error suspending this virtual machine.')));
      },

      retire(vm) {
        vm.power_state = '';
        vm.power_status = 'retiring';
        vm.normalized_state = 'unknown';

        return CollectionsApi.post('vms', vm.id, {}, { action: 'retire' })
          .then(actionSuccess(sprintf(__('%s was retired.'), vm.name)))
          .catch(actionFailure(__('There was an error retiring this virtual machine.')));
      },
    },
  };

  function actionSuccess(message) {
    return (response) => EventNotifications.success(message + ' ' + response.message);
  }

  function actionFailure(message) {
    return (response) => EventNotifications.error(message + ' ' + response.message);
  }
}

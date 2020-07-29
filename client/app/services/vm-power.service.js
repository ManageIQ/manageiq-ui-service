/** @ngInject */
export function VmPowerFactory(CollectionsApi, EventNotifications, sprintf) {
  return {
    // vm has power_state, raw_power_state; attribute normalized_state
    // + ems_id, archived, orphaned, retired, retires_on

    can: { // what ui-classic does via availability/supports in toolbars
      start(vm) {
        return vm.power_state !== 'on';
      },

      stop(vm) {
        return vm.power_state === 'on';
      },

      suspend(vm) {
        return vm.power_state === 'on';
      },

      // FIXME: unused
      retire(vm) {
        return !(vm.retired || vm.orphaned || vm.archived);
      },
    },

    state: { // TODO use, etc.
      text(vm) {
        return vm.normalized_state;
      },

      icon(vm) {
        //TODO return one of on,off,suspend*?,unknown..
        // ! normalized_state real for vms
      },
    },

    do: {
      start(vm) {
        vm.power_state = 'starting';
        vm.normalized_state = 'unknown';

        return CollectionsApi.post('vms', vm.id, {}, { action: 'start' })
          .then(actionSuccess(sprintf(__('%s was started.'), vm.name)))
          .catch(actionFailure(__('There was an error starting this virtual machine.')));
      },

      stop(vm) {
        vm.power_state = 'stopping';
        vm.normalized_state = 'unknown';

        return CollectionsApi.post('vms', vm.id, {}, { action: 'stop' })
          .then(actionSuccess(sprintf(__('%s was stopped.'), vm.name)))
          .catch(actionFailure(__('There was an error stopping this virtual machine.')));
      },

      suspend(vm) {
        vm.power_state = 'suspending';
        vm.normalized_state = 'unknown';

        return CollectionsApi.post('vms', vm.id, {}, { action: 'suspend' })
          .then(actionSuccess(sprintf(__('%s was suspended.'), vm.name)))
          .catch(actionFailure(__('There was an error suspending this virtual machine.')));
      },

      retire(vm) {
        vm.power_state = 'retiring';
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

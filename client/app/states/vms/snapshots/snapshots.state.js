import templateUrl from './snapshots.html';

/** @ngInject */
export function VmsSnapshotsState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'vms.snapshots': {
      url: '/:vmId/snapshots',
      templateUrl,
      controller: StateController,
      controllerAs: 'vm',
      title: N_('VM Snapshots'),

    },
  };
}


/** @ngInject */
function StateController($stateParams) {
  const vm = this;
  angular.extend(vm, {
    vmId: $stateParams.vmId,
  });
}

/* eslint camelcase: "off" */

export const VmSnapshotsComponent = {
  templateUrl: "app/components/vms/snapshots.html",
  controller: ComponentController,
  controllerAs: 'vm',
  bindToController: true,
  bindings: {
    vmId: '<',
  },
};

/** @ngInject */
function ComponentController(VmsService, sprintf, EventNotifications, RBAC, lodash) {
  const vm = this;

  vm.$onInit = function() {
    angular.extend(vm, {
      title: __('Catalogs'),
      vm: {},
      loading: false,

      // Functions
      resolveSnapshots: resolveSnapshots,

      // Config
      // listConfig: getListConfig(),
      // menuActions: getMenuActions(),
      // listActions: getListActions(),
      // toolbarConfig: getToolbarConfig(),
      // expandedListConfig: getExpandedListConfig(),

    });
    resolveSnapshots();
  };
  // Private
  function resolveSnapshots() {
    vm.loading = true;

    VmsService.getSnapshots(vm.vmId).then(success, failure);

    function success(response) {
      vm.loading = false;
      vm.vm = response;
    }

    function failure(error) {
      vm.loading = false;
      EventNotifications.error(__('There was an error loading snapshots.'));
    }
  }
}

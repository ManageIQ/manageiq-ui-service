/* eslint camelcase: "off" */
import templateUrl from './snapshots.html';

export const VmSnapshotsComponent = {
  templateUrl,
  controller: ComponentController,
  controllerAs: 'vm',
  bindToController: true,
  bindings: {
    vmId: '<',
  },
};

/** @ngInject */
function ComponentController(VmsService, sprintf, EventNotifications, ListView) {
  const vm = this;

  vm.$onInit = function() {
    angular.extend(vm, {
      title: __('Snapshots'),
      vm: {},
      snapshots: [],
      loading: false,
      deleteModal: false,
      deleteMessage: '',

      // Functions
      resolveSnapshots: resolveSnapshots,
      deleteSnapshots: deleteSnapshots,
      canceldelete: canceldelete,

      // Config
      listConfig: getListConfig(),
      menuActions: getMenuActions(),
      listActions: getListActions(),
      toolbarConfig: getToolbarConfig(),
    });
    resolveSnapshots();
    resolveVm();
  };

  function getToolbarConfig() {
    return {
      filterConfig: getFilterConfig(),
      sortConfig: getSortConfig(),
      actionsConfig: {
        actionsInclude: true,
      },
    };
  }

  function getListConfig() {
    return {
      showSelectBox: false,
      selectionMatchProp: 'id',
      onClick: angular.noop(),
    };
  }

  function getMenuActions() {
    return [{
      name: __('Delete'),
      title: __('Delete Catalog'),
      actionFn: confirmDelete,
    }];
  }

  function getFilterConfig() {
    return {
      fields: [
        ListView.createFilterField('name', __('Name'), __('Filter by Name'), 'text'),
        ListView.createFilterField('description', __('Description'), __('Filter by Description'), 'text'),
      ],
      resultsCount: 0,
      appliedFilters: VmsService.getFilters(),
      onFilterChange: filterChange,
    };
  }

  function getSortConfig() {
    return {
      fields: [
        ListView.createSortField('name', __('Name'), 'alpha'),
        ListView.createSortField('create_time', __('Created'), 'numeric'),
        ListView.createSortField('updated_on', __('Updated'), 'numeric'),
      ],
      onSortChange: sortChange,
      isAscending: VmsService.getSort().isAscending,
      currentField: VmsService.getSort().currentField,
    };
  }

  function getListActions() {
    return {
      title: __('Configuration'),
      name: __('Configuration'),
      actionName: 'configuration',
      icon: 'fa fa-cog',
      isDisabled: false,
      actions: [{
        name: __('Delete All Snapshots'),
        actionName: 'delete',
        title: __('Delete all snapshots'),
        actionFn: confirmDelete,
        isDisabled: false,
      }],
    };
  }

  function deleteSnapshots() {
    canceldelete();
    VmsService.deleteSnapshots(vm.vm.id, vm.deleteSnapshotId).then(success, failure);

    function success(response) {
      vm.deleteSnapshotId = undefined;
      EventNotifications.success(sprintf(__('All snapshots of vm %s have been deleted'), vm.vm.name));
      resolveSnapshots();
    }

    function failure(response) {
      EventNotifications.error(__('There was an error deleting snapshots.'));
    }
  }

  function canceldelete() {
    vm.deleteModal = false;
  }

  // Private
  function resolveSnapshots() {
    vm.loading = true;

    VmsService.getSnapshots(vm.vmId).then(success, failure);

    function success(response) {
      vm.loading = false;
      vm.toolbarConfig.filterConfig.resultsCount = response.subcount;
      vm.snapshots = response.resources;
    }

    function failure(error) {
      vm.loading = false;
      EventNotifications.error(__('There was an error loading snapshots.'));
    }
  }

  function resolveVm() {
    VmsService.getVm(vm.vmId).then(success, failure);

    function success(response) {
      vm.vm = response;
    }

    function failure(error) {
      EventNotifications.error(__('There was an error loading the vm.'));
    }
  }

  function sortChange(sortId, isAscending) {
    VmsService.setSort(sortId, isAscending);
    resolveSnapshots();
  }

  function filterChange(filters) {
    VmsService.setFilters(filters);
    resolveSnapshots();
  }

  function confirmDelete(action, item) {
    if (angular.isDefined(item)) {
      vm.deleteSnapshotId = item.id;
      vm.deleteTitle = __('Delete Snapshot');
      vm.deleteMessage = sprintf(__('Please confirm, this action will delete snapshot %s'), item.name);
    } else {
      vm.deleteTitle = sprintf(__('Delete All Snapshots on VM %s'), vm.vm.name);
      vm.deleteMessage = sprintf(__('Please confirm, this action will delete all snapshots of vm %s'), vm.vm.name);
    }
    vm.deleteModal = true;
  }
}

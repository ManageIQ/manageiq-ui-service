/* eslint camelcase: "off" */
import './_dialogs-list.sass';
import templateUrl from './dialogs-list.html';

export const DialogsListComponent = {
  templateUrl,
  bindings: {
    dialogs: "=",
  },
  controller: DialogListController,
  controllerAs: 'vm',
};

/** @ngInject */
function DialogListController($state, DialogsState, $filter, Language, ListView) {
  var vm = this;

  vm.title = __('Dialogs List');
  vm.dialogList = angular.copy(vm.dialogs);
  vm.listConfig = {
    selectItems: false,
    showSelectBox: false,
    onClick: handleClick,
  };
  vm.toolbarConfig = {
    filterConfig: {
      fields: [
        {
          id: 'label',
          title: __('Dialog Name'),
          placeholder: __('Filter by Name'),
          filterType: 'text',
        },
        {
          id: 'updated_at',
          title: __('Last Updated'),
          placeholder: __('Filter by Last Updated'),
          filterType: 'text',
        },
      ],
      resultsCount: vm.dialogList.length,
      appliedFilters: DialogsState.getFilters(),
      onFilterChange: filterChange,
    },
    sortConfig: {
      fields: getSortConfigFields(),
      onSortChange: sortChange,
      isAscending: DialogsState.getSort().isAscending,
      currentField: DialogsState.getSort().currentField,
    },
    actionsConfig: {
      primaryActions: [
        {
          name: __('Create'),
          title: __('Create a new Service Dialog'),
          actionFn: createDialog,
        },
      ],
    },
  };

  function createDialog() {
    $state.go('dialogs.edit', {dialogId: 'new'});
  }

  function handleClick(item, _event) {
    $state.go('dialogs.details', {dialogId: item.id});
  }

  function getSortConfigFields() {
    return [
      {
        id: 'label',
        title: __('Dialog Name'),
        sortType: 'alpha',
      },
      {
        id: 'updated_at',
        title: __('Last Updated'),
        sortType: 'numeric',
      },
    ];
  }

  /* Apply the filtering to the data list */
  filterChange(DialogsState.getFilters());

  function sortChange(sortId, _isAscending) {
    vm.dialogList.sort(compareFn);

    /* Keep track of the current sorting state */
    DialogsState.setSort(sortId, vm.toolbarConfig.sortConfig.isAscending);
  }

  function compareFn(item1, item2) {
    var compValue = 0;
    if (vm.toolbarConfig.sortConfig.currentField.id === 'label') {
      compValue = item1.label.localeCompare(item2.label);
    } else if (vm.toolbarConfig.sortConfig.currentField.id === 'updated_at') {
      compValue = new Date(item1.updated_at) - new Date(item2.updated_at);
    }

    if (!vm.toolbarConfig.sortConfig.isAscending) {
      compValue = compValue * -1;
    }

    return compValue;
  }

  function filterChange(filters) {
    vm.dialogList = ListView.applyFilters(filters, vm.dialogList, vm.dialogs, DialogsState, matchesFilter);

    /* Make sure sorting direction is maintained */
    sortChange(DialogsState.getSort().currentField, DialogsState.getSort().isAscending);

    vm.toolbarConfig.filterConfig.resultsCount = vm.dialogList.length;
  }

  var matchesFilter = function(item, filter) {
    if (filter.id === 'label') {
      return item.label.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
    } else if (filter.id === 'updated_at') {
      return $filter('date')(item.updated_at, 'yyyy-MM-dd hh:mm a').toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
    }

    return false;
  };

  Language.fixState(DialogsState, vm.toolbarConfig);
}

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'dialogs.list': {
        url: '',
        templateUrl: 'app/states/dialogs/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('Dialog List'),
        resolve: {
          dialogs: resolveDialogs
        }
      }
    };
  }

  /** @ngInject */
  function resolveDialogs(CollectionsApi) {
    var attributes = ['created_at', 'updated_at', 'description', 'label'];
    var options = {expand: 'resources', attributes: attributes};

    return CollectionsApi.query('service_dialogs', options);
  }

  /** @ngInject */
  function StateController($state, dialogs, DialogsState, $filter, $rootScope) {
    var vm = this;

    vm.title = __('Dialogs List');
    vm.dialogs = dialogs.resources;
    vm.dialogsList = angular.copy(vm.dialogs);

    if (angular.isDefined($rootScope.notifications) && $rootScope.notifications.data.length > 0) {
      $rootScope.notifications.data.splice(0, $rootScope.notifications.data.length);
    }

    vm.listConfig = {
      selectItems: false,
      showSelectBox: false,
      selectionMatchProp: 'dialog_status',
      onClick: handleClick
    };

    vm.toolbarConfig = {
      filterConfig: {
        fields: [
          {
            id: 'description',
            title:  __('Description'),
            placeholder: __('Filter by Description'),
            filterType: 'text'
          },
        ],
        resultsCount: vm.dialogsList.length,
        appliedFilters: DialogsState.getFilters(),
        onFilterChange: filterChange
      },
      sortConfig: {
        fields: [
          {
            id: 'label',
            title: __('Label'),
            sortType: 'alpha'
          },
          {
            id: 'id',
            title: __('Dialog ID'),
            sortType: 'numeric'
          },
          {
            id: 'updated_at',
            title: __('Updated'),
            sortType: 'alpha'
          },
          {
            id: 'created_at',
            title: __('Created'),
            sortType: 'alpha'
          }
        ],
        onSortChange: sortChange,
        isAscending: DialogsState.getSort().isAscending,
        currentField: DialogsState.getSort().currentField
      },
      actionsConfig: {
        primaryActions: [
          {
            name: __('Create'),
            title: __('Create a new Service Dialog'),
            actionFn: createDialog,
          }
        ]
      }
    };

    function createDialog() {
      $state.go('dialogs.edit', {dialogId: 'new'});
    }

    /* Apply the filtering to the data list */
    filterChange(DialogsState.getFilters());

    function handleClick(item, e) {
      $state.go('dialogs.details', {dialogId: item.id});
    }

    function sortChange(sortId, direction) {
      vm.dialogsList.sort(compareFn);

      /* Keep track of the current sorting state */
      DialogsState.setSort(sortId, vm.toolbarConfig.sortConfig.isAscending);
    }

    function compareFn(item1, item2) {
      var compValue = 0;
      if (vm.toolbarConfig.sortConfig.currentField.id === 'description') {
        compValue = item1.description.localeCompare(item2.description);
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'id') {
        compValue = item1.id - item2.id;
      }

      if (!vm.toolbarConfig.sortConfig.isAscending) {
        compValue = compValue * -1;
      }

      return compValue;
    }

    function filterChange(filters) {
      vm.filtersText = '';
      angular.forEach(filters, filterTextFactory);

      function filterTextFactory(filter) {
        vm.filtersText += filter.title + ' : ' + filter.value + '\n';
      }

      applyFilters(filters);
      vm.toolbarConfig.filterConfig.resultsCount = vm.dialogsList.length;
    }

    function applyFilters(filters) {
      vm.dialogsList = [];
      if (filters && filters.length > 0) {
        angular.forEach(vm.dialogs, filterChecker);
      } else {
        vm.dialogsList = vm.dialogs;
      }

      /* Keep track of the current filtering state */
      DialogsState.setFilters(filters);

      /* Make sure sorting direction is maintained */
      sortChange(DialogsState.getSort().currentField, DialogsState.getSort().isAscending);

      function filterChecker(item) {
        if (matchesFilters(item, filters)) {
          vm.dialogsList.push(item);
        }
      }
    }

    function matchesFilters(item, filters) {
      var matches = true;
      angular.forEach(filters, filterMatcher);

      function filterMatcher(filter) {
        if (!matchesFilter(item, filter)) {
          matches = false;

          return false;
        }
      }

      return matches;
    }

    function matchesFilter(item, filter) {
      if ('description' === filter.id) {
        return item.description.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      } else if (filter.id === 'id') {
        return String(item.id).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      }

      return false;
    }
  }
})();

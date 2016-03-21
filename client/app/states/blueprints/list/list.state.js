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
      'blueprints.list': {
        url: '', // No url, this state is the index of projects
        templateUrl: 'app/states/blueprints/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('Blueprint List'),
        resolve: {
          blueprints: resolveBlueprints
        }
      }
    };
  }

  /** @ngInject */
  function resolveBlueprints(CollectionsApi) {
    // var options = {expand: 'resources', attributes: ['picture', 'picture.image_href', 'evm_owner.name', 'v_total_vms']};

    // return CollectionsApi.query('blueprints', options);
  }

  /** @ngInject */
  function StateController($state, blueprints, BlueprintsState, $filter, $rootScope) {
    /* jshint validthis: true */
    var vm = this;

    vm.title = __('Blueprint List');

    // Mock Blueprints
    vm.blueprints = BlueprintsState.getBlueprints();

    if (angular.isDefined($rootScope.notifications) && $rootScope.notifications.data.length > 0) {
      $rootScope.notifications.data.splice(0, $rootScope.notifications.data.length);
    }

    vm.blueprintsList = angular.copy(vm.blueprints);

    vm.listConfig = {
      selectItems: false,
      showSelectBox: false,
      selectionMatchProp: 'service_status',
      onClick: handleClick
    };

    vm.actionButtons = [
      {
        name: __('Edit'),
        title: __('Edit Blueprint'),
        actionFn: editBlueprint
      }
    ];

    vm.toolbarConfig = {
      filterConfig: {
        fields: [
          {
            id: 'name',
            title: __('Name'),
            placeholder: __('Filter by Name'),
            filterType: 'text'
          }
        ],
        resultsCount: vm.blueprintsList.length,
        appliedFilters: BlueprintsState.getFilters(),
        onFilterChange: filterChange
      },
      sortConfig: {
        fields: [
          {
            id: 'name',
            title: __('Name'),
            sortType: 'alpha'
          }
        ],
        onSortChange: sortChange,
        isAscending: BlueprintsState.getSort().isAscending,
        currentField: BlueprintsState.getSort().currentField
      },
      actionsConfig: {
        primaryActions: [
          {
            name: __('Create'),
            title: __('Create a new Service Catalog'),
            actionFn: createBlueprint
          }
        ]
      }
    };

    function createBlueprint(action) {
      $state.go('blueprints.designer', {blueprintId: -1});
    };

    function editBlueprint(action, item) {
      $state.go('blueprints.designer', {blueprintId: item.id});
    };

    function deleteBlueprint(blueprintId){
      BlueprintsState.deleteBlueprint(blueprintId);
      console.log("Blueprint deleted ("+blueprint.id+")");
    }

    /* Apply the filtering to the data list */
    filterChange(BlueprintsState.getFilters());

    function handleClick(item, e) {
      $state.go('blueprints.designer', {blueprintId: item.id});
    }

    function sortChange(sortId, isAscending) {
      vm.blueprintsList.sort(compareFn);

      /* Keep track of the current sorting state */
      BlueprintsState.setSort(sortId, vm.toolbarConfig.sortConfig.isAscending);
    }

    function compareFn(item1, item2) {
      var compValue = 0;
      if (vm.toolbarConfig.sortConfig.currentField.id === 'name') {
        compValue = item1.name.localeCompare(item2.name);
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
      vm.toolbarConfig.filterConfig.resultsCount = vm.blueprintsList.length;
    }

    function applyFilters(filters) {
      vm.blueprintsList = [];
      if (filters && filters.length > 0) {
        angular.forEach(vm.blueprints, filterChecker);
      } else {
        vm.blueprintsList = vm.blueprints;
      }

      /* Keep track of the current filtering state */
      BlueprintsState.setFilters(filters);

      /* Make sure sorting direction is maintained */
      sortChange(BlueprintsState.getSort().currentField, BlueprintsState.getSort().isAscending);

      function filterChecker(item) {
        if (matchesFilters(item, filters)) {
          vm.blueprintsList.push(item);
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
      if ('name' === filter.id) {
        return item.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      }

      return false;
    }
  }
})();

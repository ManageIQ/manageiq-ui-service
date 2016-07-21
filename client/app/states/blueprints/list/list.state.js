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
          blueprints: resolveBlueprints,
          serviceCatalogs: resolveServiceCatalogs
        }
      }
    };
  }

  /** @ngInject */
  function resolveBlueprints(CollectionsApi) {
    var options = {
      mock: true,
      expand: 'resources'
    };

    return CollectionsApi.query('blueprints', options);
  }

  function resolveServiceCatalogs(CollectionsApi) {
    var options = {
      expand: 'resources',
      sort_by: 'name',
      sort_options: 'ignore_case'};

    return CollectionsApi.query('service_catalogs', options);
  }

  /** @ngInject */
  function StateController($state, blueprints, BlueprintsState, serviceCatalogs, BlueprintDetailsModal, BlueprintDeleteModal, Notifications,
                           $rootScope, Language) {
    /* jshint validthis: true */
    var vm = this;
    var categoryNames = [];
    var visibilityNames = ['Private', 'Public'];
    var publishStateNames = ['Draft', 'Published'];

    vm.title = __('Blueprint List');

    // For mock RESTFul api operations
    if (!BlueprintsState.getBlueprints()) {
      BlueprintsState.setBlueprints(blueprints.resources);
    }

    vm.blueprints = BlueprintsState.getBlueprints();
    vm.serviceCatalogs = serviceCatalogs.resources;

    angular.forEach(vm.blueprints, addMockFilters);
    angular.forEach(vm.serviceCatalogs, addCategoryFilter);

    function addMockFilters(blueprint) {
      if (!blueprint.catalog) {
        if (!categoryNames.includes(__('Unassigned'))) {
          categoryNames.push(__('Unassigned'));
        }
      } else {
        categoryNames.push(blueprint.catalog.name);
      }

      if (!visibilityNames.includes(blueprint.visibility.name)) {
        visibilityNames.push(blueprint.visibility.name);
      }
    }

    function addCategoryFilter(item) {
      categoryNames.push(item.name);
    }

    /* This notification 'splice' code doesn't work.  Splice needs a third argument, the items to splice in
     * Not sure what this code is trying to accomplish, but it exists in login, request list, & services list
    if (angular.isDefined($rootScope.notifications) && $rootScope.notifications.data.length > 0) {
      $rootScope.notifications.data.splice(0, $rootScope.notifications.data.length);
    }
    */

    vm.blueprintsList = angular.copy(vm.blueprints);

    vm.listConfig = {
      selectItems: false,
      showSelectBox: true,
      onClick: handleClick,
      onCheckBoxChange: handleCheckBoxChange
    };

    vm.actionButtons = [
      {
        name: __('Publish'),
        title: __('Publish Blueprint'),
        actionFn: publishBlueprint
      }
    ];

    vm.enableButtonForItemFn = function(action, item) {
      if (action.name === __('Publish')) {
        if (item.num_nodes > 0 && !item.published) {
          return true;
        } else {
          return false;
        }
      }
    };

    vm.menuActions = [
      {
        name: __('Edit'),
        title: __('Edit Blueprint'),
        actionFn: editBlueprint
      },
      {
        name: __('Duplicate'),
        title: __('Duplicate Blueprint'),
        actionFn: duplicateBlueprint
      },
      {
        name: __('Delete'),
        title: __('Delete Blueprint'),
        actionFn: deleteBlueprint
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
          },
          {
            id: 'visibility',
            title: __('Visibility'),
            placeholder: __('Filter by Visibility'),
            filterType: 'select',
            filterValues: visibilityNames
          },
          {
            id: 'catalog',
            title: __('Catalog'),
            placeholder: __('Filter by Catalog'),
            filterType: 'select',
            filterValues: categoryNames
          },
          {
            id: 'publishState',
            title: __('Publish State'),
            placeholder: __('Filter by Publish State'),
            filterType: 'select',
            filterValues: publishStateNames
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
          },
          {
            id: 'last_modified',
            title: __('Last Modified'),
            sortType: 'numeric'
          },
          {
            id: 'num_nodes',
            title: __('Items'),
            sortType: 'numeric'
          },
          {
            id: 'visibility',
            title: __('Visibility'),
            sortType: 'alpha'
          },
          {
            id: 'catalog',
            title: __('Catalog'),
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
            title: __('Create a new Blueprint'),
            actionFn: createBlueprint
          },
          {
            name: __('Delete'),
            title: __('Delete Blueprint'),
            actionFn: deleteBlueprints,
            isDisabled: (BlueprintsState.getSelectedBlueprints().length === 0)
          }
        ]
      }
    };

    function createBlueprint(action) {
      $state.go('blueprints.designer');
    }

    function editBlueprint(action, item) {
      $state.go('blueprints.designer', {blueprintId: item.id});
    }

    function duplicateBlueprint(action, item) {
      BlueprintsState.duplicateBlueprint(item);
      $state.go($state.current, {}, {reload: true});
    }

    function publishBlueprint(action, item) {
      if (item.num_nodes === 0) {
        Notifications.error(__('Cannot publish a blueprint with no service items.'), false, false);

        // Make sure all notifications disappear after delay
        if (angular.isDefined($rootScope.notifications) && $rootScope.notifications.data.length > 0) {
          for (var i = 0; i < $rootScope.notifications.data.length; i++) {
            $rootScope.notifications.data[i].isPersistent = false;
          }
        }
      } else {
        BlueprintDetailsModal.showModal('publish', item);
      }
    }

    function deleteBlueprint(action, item) {
      BlueprintDeleteModal.showModal([item]);
    }

    function deleteBlueprints(action) {
      BlueprintDeleteModal.showModal(BlueprintsState.getSelectedBlueprints());
    }

    function canDeleteBlueprints() {
      return BlueprintsState.getSelectedBlueprints().length > 0;
    }

    function updateActionForItemFn(action, item) {
      return (action.name === 'Publish') && (item.published !== null);
    }

    /* Apply the filtering to the data list */
    filterChange(BlueprintsState.getFilters());

    function handleClick(item, e) {
      $state.go('blueprints.designer', {blueprintId: item.id});
    }

    function handleCheckBoxChange(item, e) {
      BlueprintsState.handleSelectionChange(item);
      vm.toolbarConfig.actionsConfig.primaryActions[1].isDisabled = !canDeleteBlueprints();
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
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'last_modified') {
        compValue = new Date(item1.last_modified) - new Date(item2.last_modified);
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'num_nodes') {
        compValue = item1.num_nodes - item2.num_nodes;
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'visibility') {
        compValue = item1.visibility.name.localeCompare(item2.visibility.name);
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'catalog') {
        if (!item1.catalog) {
          compValue = -1;
        } else if (!item2.catalog) {
          compValue = 1;
        } else {
          compValue = item1.catalog.name.localeCompare(item2.catalog.name);
        }
      }

      if (!vm.toolbarConfig.sortConfig.isAscending) {
        compValue = compValue * -1;
      }

      return compValue;
    }

    function filterChange(filters) {
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
      if (filter.id === 'name') {
        return item.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      } else if (filter.id === 'visibility') {
        return item.visibility.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      } else if (filter.id === 'catalog') {
        if (filter.value.toLowerCase() === "unassigned" && !item.catalog) {
          return true;
        } else if (!item.catalog) {
          return false;
        } else {
          return item.catalog.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
        }
      } else if (filter.id === 'publishState') {
        if ( (filter.value.toLowerCase() === "published" && item.published) ||
             (filter.value.toLowerCase() === "draft" && !item.published)) {
          return true;
        } else {
          return false;
        }
      }

      return false;
    }

    Language.fixState(BlueprintsState, vm.toolbarConfig);
  }
})();

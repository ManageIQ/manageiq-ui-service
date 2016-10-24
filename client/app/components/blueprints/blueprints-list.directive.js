/* eslint camelcase: "off" */
(function() {
  'use strict';

  angular.module('app.components')
      .directive('blueprintsList', function() {
        return {
          restrict: 'AE',
          templateUrl: "app/components/blueprints/blueprints-list.html",
          scope: {
            blueprints: "=",
            serviceCatalogs: "=",
            tenants: "=",
          },
          controller: BlueprintController,
          controllerAs: 'vm',
          bindToController: true,
        };
      });

  /** @ngInject */
  function BlueprintController($state, BlueprintsState, BlueprintDetailsModal, BlueprintDeleteModal, EventNotifications, $rootScope, $filter,
                               Language, ListView) {
    var vm = this;
    var categoryNames = [];
    var visibilityNames = ['Private', 'Public'];
    var publishStateNames = ['Draft', 'Published'];
    BlueprintsState.unselectBlueprints();

    vm.title = __('Blueprint List');

    angular.forEach(vm.serviceCatalogs, addCategoryFilter);
    angular.forEach(vm.tenants, addVisibilityFilter);
    angular.forEach(vm.blueprints, getNamesFromIds);

    function addCategoryFilter(item) {
      if (categoryNames.indexOf(__('Unassigned')) === -1) {
        categoryNames.push(__('Unassigned'));
      }
      categoryNames.push(item.name);
    }

    function addVisibilityFilter(item) {
      visibilityNames.push(item.name);
    }

    function getNamesFromIds(blueprint) {
      if (blueprint.ui_properties.service_catalog) {
        var categoryName = $filter('filter')(vm.serviceCatalogs, {id: blueprint.ui_properties.service_catalog.id});
        blueprint.ui_properties.service_catalog.name = categoryName[0].name;
      }
    }

    vm.blueprintsList = angular.copy(vm.blueprints);

    vm.listConfig = {
      selectItems: false,
      showSelectBox: true,
      onClick: handleClick,
      onCheckBoxChange: handleCheckBoxChange,
    };

    vm.actionButtons = [
      {
        name: __('Publish'),
        title: __('Publish Blueprint'),
        actionFn: publishBlueprint,
      },
    ];

    vm.enableButtonForItemFn = function(action, item) {
      if (action.name === __('Publish')) {
        if (item.ui_properties.num_items > 0 && !item.published) {
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
        actionFn: editBlueprint,
      },
      {
        name: __('Duplicate'),
        title: __('Duplicate Blueprint'),
        actionFn: duplicateBlueprint,
      },
      {
        name: __('Delete'),
        title: __('Delete Blueprint'),
        actionFn: deleteBlueprint,
      },
    ];

    vm.toolbarConfig = {
      filterConfig: {
        fields: getFilterConfigFields(),
        resultsCount: vm.blueprintsList.length,
        appliedFilters: BlueprintsState.getFilters(),
        onFilterChange: filterChange,
      },
      sortConfig: {
        fields: getSortConfigFields(),
        onSortChange: sortChange,
        isAscending: BlueprintsState.getSort().isAscending,
        currentField: BlueprintsState.getSort().currentField,
      },
      actionsConfig: {
        primaryActions: [
          {
            name: __('Create'),
            title: __('Create a new Blueprint'),
            actionFn: createBlueprint,
          },
          {
            name: __('Delete'),
            title: __('Delete Blueprint'),
            actionFn: deleteBlueprints,
            isDisabled: (BlueprintsState.getSelectedBlueprints().length === 0),
          },
        ],
      },
    };

    function getFilterConfigFields() {
      return [
        ListView.createFilterField(
          'name',
          __('Name'),
            __('Filter by Name'),
          'text'),
        ListView.createFilterField(
          'visibility',
          __('Visibility'),
          __('Filter by Visibility'),
          'select',
          visibilityNames),
        ListView.createFilterField(
          'catalog',
          __('Catalog'),
          __('Filter by Catalog'),
          'select',
          categoryNames),
        ListView.createFilterField(
          'publishState',
          __('Publish State'),
          __('Filter by Publish State'),
          'select',
          publishStateNames),
      ];
    }

    function getSortConfigFields() {
      return [
        ListView.createSortField('name',          __('Name'),          'alpha'),
        ListView.createSortField('last_modified', __('Last Modified'), 'numeric'),
        ListView.createSortField('num_items',     __('Items'),         'numeric'),
        ListView.createSortField('visibility',    __('Visibility'),    'alpha'),
        ListView.createSortField('catalog',       __('Catalog'),       'alpha'),
      ];
    }

    function createBlueprint(action) {
      $state.go('designer.blueprints.editor');
    }

    function editBlueprint(action, item) {
      $state.go('designer.blueprints.editor', {blueprintId: item.id});
    }

    function duplicateBlueprint(action, item) {
      EventNotifications.error(__('Duplicate blueprint feature not available.'));
      $state.go($state.current, {}, {reload: true});
    }

    function publishBlueprint(action, item) {
      if (item.ui_properties.num_items === 0) {
        EventNotifications.error(__('Cannot publish a blueprint with no service items.'));

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

    /* Apply the filtering to the data list */
    filterChange(BlueprintsState.getFilters());

    function handleClick(item, e) {
      $state.go('designer.blueprints.editor', {blueprintId: item.id});
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
        compValue = new Date(item1.updated_at) - new Date(item2.updated_at);
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'num_items') {
        compValue = item1.ui_properties.num_items - item2.ui_properties.num_items;
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'visibility') {
        compValue = item1.ui_properties.visibility.name.localeCompare(item2.ui_properties.visibility.name);
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'catalog') {
        if (!item1.ui_properties.catalog_name) {
          compValue = -1;
        } else if (!item2.ui_properties.catalog_name) {
          compValue = 1;
        } else {
          compValue = item1.ui_properties.catalog_name.localeCompare(item2.ui_properties.catalog_name);
        }
      }

      if (!vm.toolbarConfig.sortConfig.isAscending) {
        compValue = compValue * -1;
      }

      return compValue;
    }

    function filterChange(filters) {
      vm.blueprintsList = ListView.applyFilters(filters, vm.blueprintsList, vm.blueprints, BlueprintsState, matchesFilter);

      /* Make sure sorting direction is maintained */
      sortChange(BlueprintsState.getSort().currentField, BlueprintsState.getSort().isAscending);

      vm.toolbarConfig.filterConfig.resultsCount = vm.blueprintsList.length;
    }

    var matchesFilter = function (item, filter) {
      if (filter.id === 'name') {
        return item.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      } else if (filter.id === 'visibility') {
        return item.ui_properties.visibility.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      } else if (filter.id === 'catalog') {
        if (filter.value.toLowerCase() === "unassigned" && !item.ui_properties.service_catalog) {
          return true;
        } else if (!item.ui_properties.service_catalog) {
          return false;
        } else {
          return item.ui_properties.service_catalog.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
        }
      } else if (filter.id === 'publishState') {
        if ((filter.value.toLowerCase() === "published" && item.published)
          || (filter.value.toLowerCase() === "draft" && !item.published)) {
          return true;
        } else {
          return false;
        }
      }

      return false;
    };

    Language.fixState(BlueprintsState, vm.toolbarConfig);
  }
})();

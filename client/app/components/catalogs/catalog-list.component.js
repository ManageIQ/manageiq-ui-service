/* eslint camelcase: "off" */
(function() {
  'use strict';

  angular.module('app.components')
    .component('catalogsList', {
      templateUrl: "app/components/catalogs/catalog-list.html",
      bindings: {
        designerCatalogs: "=",
        serviceTemplates: "=",
        tenants: "=",
        refreshFn: "=",
      },
      controller: ComponentController,
      controllerAs: 'vm',
      bindToController: true,
    });

  /** @ngInject */
  function ComponentController(CatalogsState, $scope, lodash, sprintf, ListView, $state) {
    var vm = this;

    vm.$onInit = function() {
      angular.extend(vm,
        {
          title: __('Catalogs'),
          designerCatalogsList: [],
          selectedCatalogs: [],
          menuActions: createMenuActions(),
          listActions: createListActions(),
          toolbarConfig: {
            filterConfig: createFilterConfig(),
            sortConfig: createSortConfig(),
            actionsConfig: createActionsConfig(),
          },
          listConfig: createListConfig(),
          serviceTemplatesListConfig: createServiceTemplatesConfig(),
          listActionDisable: listActionDisable,
        }
      );

      var catalogWatcher = $scope.$watch(function() {
        return vm.designerCatalogs;
      }, function() {
        updateCatalogsInfo();
      });

      var templatesWatcher = $scope.$watch(function() {
        return vm.serviceTemplates;
      }, function() {
        updateCatalogsInfo();
      });

      var tentantsWatcher = $scope.$watch(function() {
        return vm.tenants;
      }, function() {
        updateCatalogsInfo();
      });

      function onDestroy() {
        catalogWatcher();
        templatesWatcher();
        tentantsWatcher();
      }

      $scope.$on('destroy', onDestroy);

      updateCatalogsInfo();
    };

    function updateCatalogInfo(catalog) {
      if (!catalog.serviceTemplates) {
        catalog.serviceTemplates = [];
      } else {
        catalog.serviceTemplates.splice(0, catalog.serviceTemplates.length);
      }

      CatalogsState.setCatalogServiceTemplates(catalog, vm.serviceTemplates);

      catalog.disableRowExpansion = catalog.serviceTemplates.length < 1;

      angular.forEach(catalog.serviceTemplates, function(nextServiceTemplate) {
        CatalogsState.getServiceTemplateDialogs(nextServiceTemplate.id).then(function(response) {
          nextServiceTemplate.dialog = response.resources[0];
        });
      });

      catalog.serviceTemplatesTooltip = sprintf(__("%d Service Templates"), catalog.serviceTemplates.length);

      catalog.tenant = lodash.find(vm.tenants, {id: catalog.tenant_id});
    }

    function updateCatalogsInfo() {
      if (vm.designerCatalogs) {
        angular.forEach(vm.designerCatalogs, function(catalog) {
          updateCatalogInfo(catalog);
        });

        vm.designerCatalogs.sort(compareCatalogs);
        doFilter(CatalogsState.getFilters());
      }
    }


    function sortChange(sortId, isAscending) {
      if (vm.designerCatalogsList) {
        vm.designerCatalogsList.sort(compareCatalogs);

        /* Keep track of the current sorting state */
        CatalogsState.setSort(sortId, vm.toolbarConfig.sortConfig.isAscending);
      }
    }

    function compareCatalogs(item1, item2) {
      var sortField = vm.toolbarConfig.sortConfig.currentField;
      var compValue = 0;

      if (sortField.id === 'name') {
        compValue = item1.name.localeCompare(item2.name);
      } else if (sortField.id === 'tenant') {
        if (item1.tenant) {
          if (item2.tenant) {
            compValue = item1.tenant.name.localeCompare(item2.tenant.name);
          } else {
            compValue = -1;
          }
        } else {
          if (item2.tenant) {
            compValue = 1;
          } else {
            compValue = 0;
          }
        }
      } else if (sortField.id === 'catalogItems') {
        compValue = item1.serviceTemplates.length - item2.serviceTemplates.length;
      }

      if (compValue === 0) {
        compValue = item1.name.localeCompare(item2.name);
      }

      if (!vm.toolbarConfig.sortConfig.isAscending) {
        compValue = compValue * -1;
      }

      return compValue;
    }

    function filterChange(filters) {
      doFilter(filters);
    }

    function doFilter(filters) {
      vm.designerCatalogsList = ListView.applyFilters(filters,
                                                      vm.designerCatalogsList,
                                                      vm.designerCatalogs,
                                                      CatalogsState,
                                                      matchesFilter);
      vm.toolbarConfig.filterConfig.resultsCount = vm.designerCatalogsList.length;

      /* Make sure sorting direction is maintained */
      sortChange(CatalogsState.getSort().currentField, CatalogsState.getSort().isAscending);
    }

    function nameCompare(object, value) {
      var match = false;

      if (angular.isString(object.name) && angular.isString(value)) {
        match = object.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      }

      return match;
    }

    function matchesFilter(item, filter) {
      var found = false;

      if (filter.id === 'name') {
        found = nameCompare(item, filter.value);
      } else if (filter.id === 'description') {
        found = item.description.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      } else if (filter.id === 'tenant') {
        found = item.tenant && item.tenant.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      } else if (filter.id === 'service') {
        if (item.serviceTemplates) {
          found = lodash.find(item.serviceTemplates, function(nextService) {
            return nextService.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
          });
        }
      }

      return found;
    }

    function editCatalog(catalog) {
      $state.go('designer.catalogs.editor', {catalogId: catalog.id});
    }

    function handleEdit(action, catalog) {
      editCatalog(catalog);
    }

    function addCatalog() {
      $state.go('designer.catalogs.editor');
    }

    function handleSelectionChange() {
      vm.selectedCatalogs = vm.designerCatalogs.filter(function(catalog) {
        return catalog.selected;
      });
    }

    function editSelectedCatalog() {
      if (vm.selectedCatalogs && vm.selectedCatalogs.length === 1) {
        editCatalog(vm.selectedCatalogs[0]);
      }
    }

    function createMenuActions() {
      return [
        {
          name: __('Edit'),
          title: __('Edit Catalog'),
          actionFn: handleEdit,
        },
      ];
    }

    function createListActions() {
      return [
        {
          name: __('Configuration'),
          actionName: 'configuration',
          icon: 'fa fa-cog',
          isDisabled: false,
          actions: [
            {
              name: __('Create'),
              actionName: 'create',
              title: __('Create new catalog'),
              actionFn: addCatalog,
              isDisabled: false,
            },
            {
              name: __('Edit'),
              actionName: 'edit',
              title: __('Edit selected catalog'),
              actionFn: editSelectedCatalog,
              isDisabled: false,
            },
          ],
        },
      ];
    }

    function listActionDisable(config, items) {
      config.actions[1].isDisabled = items.length !== 1;
    }

    function createFilterConfig() {
      return {
        fields: [
          ListView.createFilterField('name',        __('Name'),        __('Filter by Name'),        'text'),
          ListView.createFilterField('description', __('Description'), __('Filter by Description'), 'text'),
          ListView.createFilterField('tenant',      __('Tenant'),      __('Filter by Tenant name'), 'text'),
          ListView.createFilterField('service',     __('Service'),     __('Filter by Service'),     'text'),
        ],
        resultsCount: 0,
        appliedFilters: CatalogsState.getFilters(),
        onFilterChange: filterChange,
      };
    }

    function createSortConfig() {
      return {
        fields: [
          ListView.createSortField('name',         __('Name'),          'alpha'),
          ListView.createSortField('tenant',       __('Tenant'),        'alpha'),
          ListView.createSortField('catalogItems', __('Catalog Items'), 'numeric'),
        ],
        onSortChange: sortChange,
        isAscending: CatalogsState.getSort().isAscending,
        currentField: CatalogsState.getSort().currentField,
      };
    }

    function createActionsConfig() {
      return {
        actionsInclude: true,
      };
    }

    function createListConfig() {
      return {
        useExpandingRows: true,
        onCheckBoxChange: handleSelectionChange,
      };
    }

    function createServiceTemplatesConfig() {
      return {
        showSelectBox: false,
      };
    }
  }
})();

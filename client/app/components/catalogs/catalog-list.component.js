/* eslint camelcase: "off" */

export const CatalogsListComponent = {
  templateUrl: "app/components/catalogs/catalog-list.html",
  controller: ComponentController,
  controllerAs: 'vm',
  bindToController: true,
};

/** @ngInject */
function ComponentController($state, Session, CatalogsState, lodash, sprintf, ListView, EventNotifications) {
  var vm = this;

  vm.$onInit = function() {
    angular.extend(vm, {
      title: __('Catalogs'),
      currentUser: Session.currentUser(),
      loading: false,
      confirmDelete: false,
      catalogsToDelete: [],
      deleteConfirmationMessage: '',

      limit: 20,
      filterCount: 0,
      catalogs: [],
      catalogsList: [],
      selectedItemsList: [],
      limitOptions: [5, 10, 20, 50, 100, 200, 500, 1000],

      // Functions
      resolveCatalogs: resolveCatalogs,
      removeCatalog: removeCatalog,
      cancelRemoveCatalog: cancelRemoveCatalog,
      listActionDisable: listActionDisable,

      // Config
      listConfig: getListConfig(),
      menuActions: getMenuActions(),
      listActions: getListActions(),
      toolbarConfig: getToolbarConfig(),
      expandedListConfig: getExpandedListConfig(),

    });

    resolveCatalogs(vm.limit, 0);

  };

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
    vm.catalogsList = ListView.applyFilters(filters, vm.catalogsList, vm.catalogs, CatalogsState, matchesFilter);
    resolveCatalogs(vm.limit, 0);

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

    function nameCompare(object, value) {
      var match = false;

      if (angular.isString(object.name) && angular.isString(value)) {
        match = object.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      }

      return match;
    }
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
    vm.selectedItemsList = vm.designerCatalogs.filter(function(catalog) {
      return catalog.selected;
    });
  }

  function editSelectedCatalog() {
    if (vm.selectedItemsList && vm.selectedItemsList.length === 1) {
      editCatalog(vm.selectedItemsList[0]);
    }
  }

  function removeCatalog() {
    var deleteCatalogs;

    if (vm.catalogsToDelete.length > 0) {
      deleteCatalogs = vm.catalogsToDelete;
    } else if (vm.catalogToDelete) {
      deleteCatalogs = [vm.catalogToDelete];
    }

    if (deleteCatalogs.length > 0) {
      CatalogsState.deleteCatalogs(deleteCatalogs).then(removeSuccess, removeFailure);
    }
    vm.confirmDelete = false;
    vm.catalogsToDelete.splice(0, vm.catalogsToDelete.length);

    function removeSuccess() {
      vm.refreshFn();
    }

    function removeFailure() {
      vm.refreshFn();
    }
  }

  function cancelRemoveCatalog() {
    vm.catalogToDelete = undefined;
    vm.catalogsToDelete.splice(0, vm.catalogsToDelete.length);
    vm.confirmDelete = false;
  }

  function handleDelete(action, catalog) {
    vm.catalogToDelete = catalog;
    vm.confirmDelete = true;
    vm.deleteConfirmationMessage = sprintf(__('Are you sure you want to delete catalog %s?'),
      vm.catalogToDelete.name);
  }

  function deleteSelectedCatalogs() {
    vm.catalogsToDelete.splice(0, vm.catalogsToDelete.length);
    angular.forEach(vm.selectedItemsList, function(selected) {
      vm.catalogsToDelete.push(selected);
    });

    vm.confirmDelete = true;
    vm.deleteConfirmationMessage = sprintf(__('Are you sure you want to delete %d catalogs?'),
      vm.catalogsToDelete.length);
  }

  function listActionDisable(config, items) {
    // editListAction.isDisabled = items.length !== 1;
    // deleteListAction.isDisabled = items.length < 1;
  }

  // Config

  function getListConfig() {
    return {
      // showSelectBox: checkApproval(),
      useExpandingRows: true,
      selectionMatchProp: 'id',
      // onClick: expandRow,
      onCheckBoxChange: handleSelectionChange,
    };
  }

  function getMenuActions() {
    return [
      {
        name: __('Edit'),
        title: __('Edit Catalog'),
        actionFn: handleEdit,
      },
      {
        name: __('Delete'),
        title: __('Delete Catalog'),
        actionFn: handleDelete,
      },
    ];
  }

  function getListActions() {
    return [
      {
        name: __('Configuration'),
        actionName: 'configuration',
        icon: 'fa fa-cog',
        isDisabled: false,
        actions: [{
          name: __('Create'),
          actionName: 'create',
          title: __('Create new catalog'),
          actionFn: addCatalog,
          isDisabled: false,
        }, {
          name: __('Edit'),
          actionName: 'edit',
          title: __('Edit selected catalog'),
          actionFn: editSelectedCatalog,
          isDisabled: false,
        }, {
          name: __('Delete'),
          actionName: 'delete',
          title: __('Delete selected catalogs'),
          actionFn: deleteSelectedCatalogs,
          isDisabled: false,
        }],
      },
    ];
  }

  function getToolbarConfig() {
    return {
      filterConfig: getFilterConfig(),
      sortConfig: getSortConfig(),
      actionsConfig: {
        actionsInclude: true,
      },
    };
  }

  function getFilterConfig() {
    return {
      fields: [
        ListView.createFilterField('name', __('Name'), __('Filter by Name'), 'text'),
        ListView.createFilterField('description', __('Description'), __('Filter by Description'), 'text'),
        ListView.createFilterField('tenant', __('Tenant'), __('Filter by Tenant name'), 'text'),
        ListView.createFilterField('service', __('Service'), __('Filter by Service'), 'text'),
      ],
      resultsCount: 0,
      appliedFilters: CatalogsState.getFilters(),
      onFilterChange: filterChange,
    };
  }

  function getSortConfig() {
    return {
      fields: [
        ListView.createSortField('name', __('Name'), 'alpha'),
        ListView.createSortField('tenant', __('Tenant'), 'alpha'),
        ListView.createSortField('catalogItems', __('Catalog Items'), 'numeric'),
      ],
      onSortChange: sortChange,
      isAscending: CatalogsState.getSort().isAscending,
      currentField: CatalogsState.getSort().currentField,
    };
  }

  function getExpandedListConfig(){
    return {
      showSelectBox: false,
      selectionMatchProp: 'id',
      onClick: viewDetails,
    };
  }

  // Private

  function resolveCatalogs(limit, offset, refresh) {
    if (!refresh) {
      vm.loading = true;
    }

    vm.offset = offset;
    CatalogsState.getCatalogs(
      limit,
      offset,
      CatalogsState.getFilters(),
      CatalogsState.getSort().currentField,
      CatalogsState.getSort().isAscending).then(success, failure);

    function success(response) {
      vm.loading = false;
      vm.catalogs = [];
      vm.selectedItemsList = [];
      vm.toolbarConfig.filterConfig.resultsCount = vm.filterCount;

      angular.forEach(response.resources, checkExpansion);

      function checkExpansion(item) {
        if (angular.isDefined(item.id)) {
          item.disableRowExpansion = angular.isUndefined(item.service_templates) || item.service_templates.length;
          vm.catalogs.push(item);
        }
      }


      vm.catalogsList = angular.copy(vm.catalogs);

      getFilterCount();

      function getFilterCount() {
        CatalogsState.getMinimal(CatalogsState.getFilters()).then(querySuccess, failure);

        function querySuccess(result) {
          vm.filterCount = result.subcount;
        }
      }
    }

    function failure(error) {
      vm.loading = false;
      EventNotifications.error(__('There was an error loading catalogs.'));
    }
  }

  function sortChange(sortId, direction) {
    CatalogsState.setSort(sortId, direction);
    resolveCatalogs(vm.limit, 0)
  }

  function viewDetails(template) {
    $state.go('marketplace.details', {serviceTemplateId: template.id});
  }

}

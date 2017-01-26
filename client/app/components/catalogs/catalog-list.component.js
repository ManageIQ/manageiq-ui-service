/* eslint camelcase: "off" */

export const CatalogsListComponent = {
  templateUrl: "app/components/catalogs/catalog-list.html",
  controller: ComponentController,
  controllerAs: 'vm',
  bindToController: true,
};

/** @ngInject */
function ComponentController($state, Session, CatalogsState, sprintf, ListView, EventNotifications) {
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
    vm.selectedItemsList = vm.catalogsList.filter(function(catalog) {
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


  // Config

  function getListConfig() {
    return {
      // showSelectBox: checkApproval(),
      useExpandingRows: true,
      selectionMatchProp: 'id',
      onClick: expandRow,
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
    return [{
      title: __('Configuration'),
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
    }, {
      title: __('List Actions'),
      name: __(''),
      actionName: 'listActions',
      icon: 'fa fa-wrench',
      isDisabled: false,
      actions: [{
        name: __('Select All'),
        actionName: 'select',
        title: __('Select All'),
        actionFn: selectAll,
        isDisabled: false,
      }, {
        name: __('Expand All'),
        actionName: 'expand',
        title: __('Expand All'),
        actionFn: toggleExpand,
        isDisabled: false,
      }],
    }];
  }

  function listActionDisable(config, items) {
    switch (config.actionName) {
      case 'configuration':
        config.actions[0].isDisabled = items.length >= 1;
        config.actions[1].isDisabled = items.length !== 1;
        config.actions[2].isDisabled = !items.length >= 1;
        break;
    }
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
        // ListView.createFilterField('tenant', __('Tenant'), __('Filter by Tenant name'), 'text'),
        // ListView.createFilterField('service', __('Service'), __('Filter by Service'), 'text'),
      ],
      resultsCount: 0,
      appliedFilters: CatalogsState.getFilters(),
      onFilterChange: filterChange,
    };
  }

  function filterChange(filters) {
    CatalogsState.setFilters(filters);
    resolveCatalogs(vm.limit, 0);
  }

  function getSortConfig() {
    return {
      fields: [
        ListView.createSortField('name', __('Name'), 'alpha'),
        ListView.createSortField('tenant_id', __('Tenant'), 'numeric'),
        // ListView.createSortField('service_templates.count', __('Catalog Items'), 'numeric'),
      ],
      onSortChange: sortChange,
      isAscending: CatalogsState.getSort().isAscending,
      currentField: CatalogsState.getSort().currentField,
    };
  }

  function getExpandedListConfig() {
    return {
      showSelectBox: false,
      selectionMatchProp: 'id',
      onClick: viewDetails,
    };
  }

  // Private

  function resolveCatalogs(limit, offset) {
    vm.loading = true;
    vm.offset = offset;

    CatalogsState.getCatalogs(limit, offset).then(success, failure);

    function success(response) {
      vm.loading = false;
      vm.catalogsList = [];
      vm.selectedItemsList = [];

      response.resources.forEach((item) => {
        if (angular.isDefined(item.id)) {
          item.disableRowExpansion = angular.isUndefined(item.service_templates) || item.service_templates.length;
          vm.catalogsList.push(item);
        }
      });

      getFilterCount();

      function getFilterCount() {
        CatalogsState.getMinimal(limit, offset).then(success, failure);

        function success(result) {
          vm.filterCount = result.subcount;
          vm.toolbarConfig.filterConfig.resultsCount = result.subcount;
        }
      }
    }

    function failure(error) {
      vm.loading = false;
      EventNotifications.error(__('There was an error loading catalogs.'));
    }
  }

  function sortChange(sortId, isAscending) {
    CatalogsState.setSort(sortId, isAscending);
    resolveCatalogs(vm.limit, 0);
  }

  function viewDetails(template) {
    $state.go('marketplace.details', {serviceTemplateId: template.id});
  }

  function expandRow(item) {
    if (!item.disableRowExpansion) {
      item.isExpanded = !item.isExpanded;
    }
  }

  function toggleExpand() {
    vm.catalogsList.forEach((item) => {
      expandRow(item);
    })
  }

  function selectAll() {
    vm.catalogsList.forEach((item) => {
      item.selected = !item.selected;
    })
  }
}

/* eslint camelcase: "off" */
import '../../assets/sass/_explorer.sass';
import templateUrl from './catalog-explorer.html';

export const CatalogExplorerComponent = {
  templateUrl,
  controller: ComponentController,
  controllerAs: 'vm',
  bindToController: true,
};

/** @ngInject */
function ComponentController($state, Session, CatalogsState, sprintf, ListView, EventNotifications, lodash) {
  var vm = this;
  vm.permissions = CatalogsState.getPermissions();

  vm.$onInit = function() {
    angular.extend(vm, {
      title: __('Catalogs'),
      currentUser: Session.currentUser(),
      loading: false,
      confirmDelete: false,
      catalogsToDelete: [],
      deleteConfirmationMessage: '',
      viewType: 'listView',

      limit: 20,
      filterCount: 0,
      catalogsList: [],
      serviceTemplateList: [],
      selectedItemsList: [],
      limitOptions: [5, 10, 20, 50, 100, 200, 500, 1000],

      // Functions
      cancelRemoveCatalog: cancelRemoveCatalog,
      checkApproval: checkApproval,
      listActionDisable: listActionDisable,
      removeCatalog: removeCatalog,
      resolveCatalogs: resolveCatalogs,
      updatePagination: updatePagination,
      viewSelected: viewSelected,

      // Config
      cardConfig: getCardConfig(),
      listConfig: getListConfig(),
      menuActions: getMenuActions(),
      listActions: getListActions(),
      toolbarConfig: getToolbarConfig(),
      expandedListConfig: getExpandedListConfig(),

    });

    resolveCatalogs(vm.limit, 0);
  };

  function editCatalog(catalog) {
    if (angular.isUndefined(catalog.id)) {
      catalog = vm.selectedItemsList[0];
    }
    $state.go('catalogs.editor', {catalogId: catalog.id});
  }

  function handleEdit(_action, catalog) {
    editCatalog(catalog);
  }

  function addCatalog() {
    $state.go('catalogs.editor');
  }

  function handleSelectionChange() {
    vm.selectedItemsList = vm.catalogsList.filter(function(catalog) {
      return catalog.selected;
    });
  }

  function removeCatalog() {
    var deleteCatalogs;

    if (vm.catalogsToDelete.length > 0) {
      deleteCatalogs = vm.catalogsToDelete;
    } else if (vm.catalogToDelete) {
      deleteCatalogs = [vm.catalogToDelete];
    }

    if (deleteCatalogs.length > 0) {
      CatalogsState.deleteCatalogs(deleteCatalogs).then(removeSuccess,
        removeFailure);
    }
    vm.confirmDelete = false;
    vm.catalogsToDelete.splice(0, vm.catalogsToDelete.length);

    function removeSuccess() {
      resolveCatalogs(vm.limit, 0);
    }

    function removeFailure() {
      resolveCatalogs(vm.limit, 0);
    }
  }

  function cancelRemoveCatalog() {
    vm.catalogToDelete = undefined;
    vm.catalogsToDelete.splice(0, vm.catalogsToDelete.length);
    vm.confirmDelete = false;
  }

  function handleDelete(_action, catalog) {
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

  function getCardConfig() {
    return {
      showSelectBox: false,
      selectionMatchProp: 'id',
      onClick: viewDetails,
    };
  }

  function getListConfig() {
    return {
      showSelectBox: checkApproval(),
      useExpandingRows: true,
      selectionMatchProp: 'id',
      onClick: toggleRow,
      onCheckBoxChange: handleSelectionChange,
    };
  }

  function getMenuActions() {
    const menuActionsConfig = [{
      name: __('Edit'),
      title: __('Edit Catalog'),
      actionFn: handleEdit,
      permissions: vm.permissions.edit,
    }, {
      name: __('Delete'),
      title: __('Delete Catalog'),
      actionFn: handleDelete,
      permissions: vm.permissions.delete,
    }];

    return menuActionsConfig.filter((item) => item.permissions);
  }

  function getListActions() {
    const configurationMenuOptions = [{
      name: __('Create'),
      actionName: 'create',
      title: __('Create new catalog'),
      actionFn: addCatalog,
      isDisabled: false,
      permissions: vm.permissions.create,
    }, {
      name: __('Edit'),
      actionName: 'edit',
      title: __('Edit selected catalog'),
      actionFn: editCatalog,
      isDisabled: false,
      permissions: vm.permissions.edit,
    }, {
      name: __('Delete'),
      actionName: 'delete',
      title: __('Delete selected catalogs'),
      actionFn: deleteSelectedCatalogs,
      isDisabled: false,
      permissions: vm.permissions.delete,
    }];

    const itemActions = [{
      title: __('Configuration'),
      name: __('Configuration'),
      actionName: 'configuration',
      icon: 'fa fa-cog',
      isDisabled: false,
      actions: configurationMenuOptions.filter((item) => item.permissions),
    }];

    let selectAllDisabled = true;
    if (vm.permissions.edit || vm.permissions.delete) {
      selectAllDisabled = false;
    }
    const listActions = [{
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
        isDisabled: selectAllDisabled,
      }, {
        name: __('Unselect All'),
        actionName: 'unselect',
        title: __('Unselect All'),
        actionFn: unselectAll,
        isDisabled: selectAllDisabled,
      }, {
        name: __('Expand All'),
        actionName: 'expand',
        title: __('Expand All'),
        actionFn: expandAll,
        isDisabled: false,
      }, {
        name: __('Collapse All'),
        actionName: 'collapse',
        title: __('Collapse All'),
        actionFn: collapseAll,
        isDisabled: false,
      }],
    }];

    return itemActions[0].actions.length > 0 ? itemActions.concat(listActions) : listActions;
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
      vm.serviceTemplateList = [];
      vm.selectedItemsList = [];

      response.resources.forEach((item) => {
        if (angular.isDefined(item.service_templates)) {
          item.service_templates.resources = item.service_templates.resources.filter((template) => template.display);

          item.disableRowExpansion = item.service_templates.resources.length === 0;
        }
        vm.serviceTemplateList.push(item.service_templates.resources);
        vm.catalogsList.push(item);
      });
      vm.serviceTemplateList = lodash.flattenDeep(vm.serviceTemplateList);

      getFilterCount();

      function getFilterCount() {
        CatalogsState.getMinimal(limit, offset).then(success, failure);

        function success(result) {
          vm.filterCount = result.subcount;
          vm.toolbarConfig.filterConfig.resultsCount = result.subcount;
        }
      }
    }

    function failure(_error) {
      vm.loading = false;
      EventNotifications.error(__('There was an error loading catalogs.'));
    }
  }

  function sortChange(sortId, isAscending) {
    CatalogsState.setSort(sortId, isAscending);
    resolveCatalogs(vm.limit, 0);
  }

  function viewDetails(template) {
    $state.go('catalogs.details', {serviceTemplateId: template.id});
  }

  function toggleRow(item) {
    if (!item.disableRowExpansion) {
      item.isExpanded = !item.isExpanded;
    }
  }

  function expandAll() {
    vm.catalogsList.forEach((item) => {
      if (!item.disableRowExpansion) {
        item.isExpanded = true;
      }
    });
  }

  function collapseAll() {
    vm.catalogsList.forEach((item) => {
      if (!item.disableRowExpansion) {
        item.isExpanded = false;
      }
    });
  }

  function selectAll() {
    vm.catalogsList.forEach((item) => {
      item.selected = true;
      vm.selectedItemsList.push(item);
    });
  }

  function unselectAll() {
    vm.selectedItemsList = [];
    vm.catalogsList.forEach((item) => {
      item.selected = false;
    });
  }

  function checkApproval() {
    if (vm.permissions.edit || vm.permissions.delete) {
      return true;
    }

    return false;
  }

  function viewSelected(viewId) {
    vm.viewType = viewId;
  }

  function updatePagination(limit, offset) {
    vm.limit = limit;
    vm.offset = offset;
    vm.resolveCatalogs(limit, offset);
  }
}

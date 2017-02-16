/* eslint camelcase: "off" */
export const TemplateExplorerComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  templateUrl: 'app/components/template-explorer/template-explorer.html',
};

/** @ngInject */
function ComponentController($filter, lodash, ListView, Language, Templates, EventNotifications, Session, RBAC, ModalService,
                             CollectionsApi, sprintf, Polling, $log) {
  const vm = this;
  vm.$onInit = activate();
  vm.$onDestroy = function() {
    Polling.stop('templateListPolling');
  };

  function activate() {
    angular.extend(vm, {
      currentUser: Session.currentUser(),
      loading: false,
      templates: [],
      limit: 20,
      filterCount: 0,
      filters: [],
      templatesList: [],
      selectedItemsList: [],
      limitOptions: [5, 10, 20, 50, 100, 200, 500, 1000],
      selectedItemsListCount: 0,
      // Functions
      resolveTemplates: resolveTemplates,
     // listActionDisable: listActionDisable,
      updatePagination: updatePagination,
      // Config setup
      actionConfig: getActionConfig(),
      menuActions: getMenuActions(),
      toolbarConfig: getToolbarConfig(),
      listConfig: getListConfig(),
      sortConfig: getSortConfig(),
      offset: 0,
      pollingInterval: 10000,
    });

    resolveTemplates(vm.limit, 0);
    Polling.start('templateListPolling', pollTemplates, vm.pollingInterval);
  }

  function getActionConfig() {
    return [
    ];
  }

  function getListConfig() {
    return {
      useExpandingRows: false,
      selectionMatchProp: 'id',
      onCheckBoxChange: selectionChange,
    };
  }
  function getSortConfig() {
    return {
      direction: 'asc',
      field: 'name',
      sortOptions: 'alpha',
    };
  }
  function getToolbarConfig() {
    var sortOrderFields = getOrderSortFields();
    const sortConfig = {
      fields: sortOrderFields,
      onSortChange: sortChange,
      isAscending: true,
      currentField: sortOrderFields[0],
    };

    const filterConfig = {
      fields: getOrderFilterFields(),
      resultsCount: 0,
      appliedFilters: [],
      onFilterChange: filterChange,
    };

    return {
      sortConfig: sortConfig,
      filterConfig: filterConfig,
      actionsConfig: {
      },
    };
  }

  function getOrderFilterFields() {
    return [
      ListView.createFilterField('name', __('Name'), __('Filter by Name'), 'text'),
      ListView.createFilterField('type', __('Type'), __('Filter by Type'), 'text'),
      ListView.createFilterField('draft', __('Draft'), __('Filter by Draft'), 'text'),
    ];
  }

  function getOrderSortFields() {
    return [
      ListView.createSortField('name', __('Name'), 'alpha'),
      ListView.createSortField('type', __('Type'), 'alpha'),
    ];
  }

  function getMenuActions() {
    const menuActions = [
    ];

    return menuActions;
  }

  function sortChange(sortId, direction) {
    vm.sortConfig.field = sortId.id;
    vm.sortConfig.direction = direction === true ? 'asc' : 'desc';
    vm.sortConfig.sortOptions = sortId.sortType === 'alpha' ? 'ignore_case' : '';

    resolveTemplates(vm.limit, 0);
  }
  function filterChange(filters) {
    vm.filters = filters;
    resolveTemplates(vm.limit, 0);
  }
  function resolveTemplates(limit, offset, refresh) {
    if (!refresh) {
      vm.loading = true;
    }
    var existingTemplates = (angular.isDefined(vm.templatesList) && refresh ? angular.copy(vm.templatesList) : []);
    vm.offset = String(offset);

    Templates.getMinimal(vm.filters).then(setResultTotals);
    Templates.getTemplates(limit, vm.offset, vm.filters, vm.sortConfig).then(querySuccess);

    function querySuccess(response) {
      vm.loading = false;
      vm.toolbarConfig.filterConfig.resultsCount = vm.filterCount;
      vm.templates = [];
      vm.templates = response.resources;

      if (refresh && vm.selectedItemsList.length > 0) {
        vm.templatesList = [];
        angular.forEach(vm.templates, checkSelected);
      } else {
        vm.templatesList = angular.copy(vm.templates);
      }

      function checkSelected(template) {
        template.selected = false;
        for (var i = 0; i < vm.selectedItemsList.length; i++) {
          var currentItem = vm.selectedItemsList[i];
          if (currentItem.id === template.id) {
            if (angular.isDefined(currentItem.selected) && currentItem.selected === true) {
              template.selected = true;
            }
            break;
          }
        }
        vm.templatesList.push(template);
      }
    }

    function queryFailure(error) {
      vm.loading = false;
      EventNotifications.error(__('There was an error loading templates.'));
    }
  }

  function selectionChange(item) {
    vm.selectedItemsList = vm.templatesList.filter(function (service) {
      return service.selected;
    });
  }

  function updatePagination(limit, offset) {
    vm.limit = limit;
    vm.offset = offset;
    vm.resolveTemplates(limit, offset);
  }

  function setResultTotals(response) {
    vm.requestCount = response.subcount;
    vm.filterCount = response.subcount;
    vm.toolbarConfig.filterConfig.resultsCount = vm.requestCount;
  }

  function pollTemplates() {
    resolveTemplates(vm.limit, vm.offset, true);
  }
}

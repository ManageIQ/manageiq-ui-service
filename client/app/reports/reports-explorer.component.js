import '../../assets/sass/_explorer.sass';
import templateUrl from './reports-explorer.html';

export const ReportsExplorerComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  templateUrl,
};

/** @ngInject */
function ComponentController(ListView, ReportsService, EventNotifications, Polling) {
  const vm = this;
  
  vm.$onInit = activate();
  vm.$onDestroy = function() {
    Polling.stop('reportsListPolling');
  };

  function activate() {
    angular.extend(vm, {
      loading: false,
      reports: [],
      limit: 20,
      filterCount: 0,
      filters: [],
      limitOptions: [5, 10, 20, 50, 100, 200, 500, 1000],
      resolveReports: resolveReports,
      updatePagination: updatePagination,
      toolbarConfig: getToolbarConfig(),
      listConfig: getListConfig(),
      sortConfig: getSortConfig(),
      offset: 0,
      pollingInterval: 10000,
    });

    resolveReports(vm.limit, 0);
    Polling.start('reportsListPolling', pollReports, vm.pollingInterval);
  }

  function getListConfig() {
    return {
      useExpandingRows: false,
      showSelectBox: false,
    };
  }

  function getSortConfig() {
    return {
      direction: 'asc',
      field: 'name',
      sortOptions: 'alpha',
    };
  }

  function getFilterFields() {
    return [
      ListView.createFilterField('name', __('Name'), __('Filter by Name'), 'text'),
    ];
  }

  function getSortFields() {
    return [
      ListView.createSortField('name', __('Name'), 'alpha'),
    ];
  }

  function sortChange(sortId, direction) {
    vm.sortConfig.field = sortId.id;
    vm.sortConfig.direction = direction === true ? 'asc' : 'desc';
    vm.sortConfig.sortOptions = sortId.sortType === 'alpha' ? 'ignore_case' : '';

    resolveReports(vm.limit, 0);
  }

  function filterChange(filters) {
    vm.filters = filters;
    vm.loading = true;
    resolveReports(vm.limit, 0);
  }

  function resolveReports(limit, offset, refresh) {
    if (!refresh) {
      vm.loading = true;
    }
    vm.offset = String(offset);

    ReportsService.getMinimal(vm.filters).then(setResultTotals);
    ReportsService.getReports(limit, vm.offset, vm.filters, vm.sortConfig)
      .then(querySuccess, queryFailure);

    function querySuccess(response) {
      vm.loading = false;
      vm.reports = response.resources;
    }

    function queryFailure(_error) {
      vm.loading = false;
      EventNotifications.error(__('There was an error loading reports.'));
    }
  }

  function updatePagination(limit, offset) {
    vm.limit = limit;
    vm.offset = offset;
    vm.resolveReports(limit, offset);
  }
  function getToolbarConfig() {
    const sortFields = getSortFields();

    const toolbarConfig = {
      actionsConfig: {
        actionsInclude: true,
      },
      filterConfig: {
        fields: getFilterFields(),
        appliedFilters: [],
        onFilterChange: filterChange,
      },
      sortConfig: {
        fields: sortFields,
        onSortChange: sortChange,
        isAscending: true,
        currentField: sortFields[0],
      },
    };

    return toolbarConfig;
  }

  function setResultTotals(response) {
    vm.requestCount = response.subcount;
    vm.filterCount = response.subcount;
    vm.toolbarConfig.filterConfig.resultsCount = vm.requestCount;
  }

  function pollReports() {
    resolveReports(vm.limit, vm.offset, true);
  }
}

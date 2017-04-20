import '../../assets/sass/_explorer.sass';
import templateUrl from './reports-explorer.html';

export const ReportsExplorerComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  templateUrl,
};

/** @ngInject */
function ComponentController(ListView, ReportsService, EventNotifications, Polling, POLLING_INTERVAL) {
  const vm = this;
  vm.$onInit = activate();
  vm.$onDestroy = function() {
    Polling.stop('reportsListPolling');
  };

  function activate() {
    ReportsService.listActions.setSort(ReportsService.listActions.getSort().currentField, false);

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
      offset: 0,
      pollingInterval: POLLING_INTERVAL,
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

  function getFilterFields() {
    return [
      ListView.createFilterField('name', __('Name'), __('Filter by Name'), 'text'),
    ];
  }

  function getSortFields() {
    return [
      ListView.createSortField('updated_on', __('Updated'), 'numeric'),
      ListView.createSortField('name', __('Name'), 'alpha'),
    ];
  }

  function sortChange(sortId, direction) {
    ReportsService.listActions.setSort(sortId, direction);

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
    ReportsService.getReports(limit, vm.offset, vm.filters)
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
        fields: getSortFields(),
        onSortChange: sortChange,
        isAscending: ReportsService.listActions.getSort().isAscending,
        currentField: ReportsService.listActions.getSort().currentField,
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

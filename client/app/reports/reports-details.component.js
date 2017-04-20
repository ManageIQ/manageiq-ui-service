import './_report-details.sass';
import templateUrl from './reports-details.html';

export const ReportsDetailsComponent = {
  controllerAs: 'vm',
  controller: ComponentController,
  templateUrl,
  bindings: {
    report: "<",
  },
};

/** @ngInject */
function ComponentController($state, ReportsService, FileSaver, Blob, CollectionsApi, EventNotifications, Polling, POLLING_INTERVAL) {
  const vm = this;

  vm.$onInit = activate();
  vm.$onDestroy = onDestroy;

  function onDestroy() {
    Polling.stop('reportRunsPolling');
  }

  function activate() {
    angular.extend(vm, {
      downloadReport: downloadReport,
      viewReport: viewReport,
      disableRowMenuItems: disableRowMenuItems,
      loading: false,
      limit: 20,
      limitOptions: [5, 10, 20, 50, 100, 200, 500, 1000],
      listActions: getListActions(),
      updatePagination: updatePagination,
      queueReport: queueReport,
      listConfig: getListConfig(),
      toolbarConfig: getToolbarConfig(),
      offset: 0,
      reportRunsCount: 0,
      pollingInterval: POLLING_INTERVAL,
      permissions: ReportsService.getPermissions(),
    });
    getReportRuns();
    getReportRunsCount();
    Polling.start('reportRunsPolling', reportRunsPolling, vm.pollingInterval);
  }
  function getListConfig() {
    return {
      useExpandingRows: false,
      showSelectBox: false,
    };
  }
  function updatePagination(limit, offset) {
    vm.limit = limit;
    vm.offset = offset;
    getReportRuns();
  }
  function queueReport() {
    ReportsService.queueReport(vm.report.id, {'action': 'run'}).then(function(_data) {
      EventNotifications.success(__('Report has been queued'));
    });    
  }
  function getReportRunsCount() {
    ReportsService.getReportRuns(vm.report.id, 0, 0).then((results) => {
      vm.reportRunsCount = results.subcount;
    });
  }
  function getReportRuns() {
    ReportsService.getReportRuns(vm.report.id, vm.limit, vm.offset, {}, true).then((results) => {
      vm.report.runs = results.resources;
    });
  }
  function viewReport(item, _event) {
    $state.go('reports.view', {reportId: item.miq_report_id, reportRunId: item.id});
  }
  function downloadReport(runId) {
    var options = {
      expand: ['resources'],
    };

    const reportUrl = `${vm.report.id}/results/${runId}`;

    CollectionsApi.get('reports', reportUrl, options).then((data) => {
      const csv = generateCSV(data.report.col_order, data.result_set);
      const reportBlob = new Blob(csv, { type: 'text/csv;charset=utf-8' });
      FileSaver.saveAs(reportBlob, 'report.csv');
    });
  }

  function generateCSV(headers, rows) {
    const csv = [];
    csv.push(headers.join(',') + "\r\n");
    angular.forEach(rows, (row) => {
      const csvRow = [];

      angular.forEach(headers, (header) => {
        let csvField = '';
        if (angular.isDefined(row[header])) {
          let field = String(row[header]);
          if (field.includes(',')) {
            field = `"${field}"`;
          }
          csvField = field;
        }
        csvRow.push(csvField);
      });
      csv.push(csvRow.join(',') + "\r\n");
    });

    return csv;
  }
  function getListActions() {
    const listActions = [];
    listActions.push(
      {
        actionName: 'reportOptions',
        icon: 'fa fa fa-cog',
        actions: [
          {
            name: __('Queue Report'),
            actionName: 'queue',
            title: __('Queue Report'),
            actionFn: queueReport,
          },
        ],
        isDisabled: false,
      }
    );

    return listActions;
  }
  function getToolbarConfig() {
    return {
      actionsConfig: {
        actionsInclude: true,
      },
    };
  }
  function disableRowMenuItems(item) {
    if (angular.isUndefined(item.last_run_on)) {
    //  console.log("i have a task id");
      return true;
    } else {
      return false; 
    }
  }
  function reportRunsPolling() {
    getReportRuns();
  }
}

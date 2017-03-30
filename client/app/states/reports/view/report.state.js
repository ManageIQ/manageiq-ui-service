/* eslint camelcase: "off" */
import './_report.sass';
import templateUrl from './report.html';

/** @ngInject */
export function ReportState(routerHelper, RBAC) {
  routerHelper.configureStates(getStates(RBAC));
}

function getStates(RBAC) {
  return {
    'reports.view': {
      url: '/view/:reportId/:reportRunId',
      templateUrl,
      controller: StateController,
      controllerAs: 'vm',
      title: __('Report'),
      resolve: {
        report: resolveReport,
      },
      data: {
        authorization: RBAC.hasAny(['miq_report_view']),
      },
    },
  };
}

/** @ngInject */
function resolveReport($stateParams, CollectionsApi) {
  var options = {
    expand: ['resources'],
  };

  const reportUrl = `${$stateParams.reportId}/results/${$stateParams.reportRunId}`;
  
  return CollectionsApi.get('reports', reportUrl, options);
}

/** @ngInject */
function StateController(report, lodash) {
  var vm = this;
  
  vm.report = report.report;
  vm.report.runId = report.id;
  vm.report.reportId = report.miq_report_id;
  vm.report.result_set = report.result_set;
  vm.selectedHeaderFields = [];
  vm.checkboxChange = checkboxChange;
  vm.reportFilters = false;
  vm.headerOptions = [];

  angular.forEach(vm.report.headers, (header, columnNumber) => {
    const headerObject = {
      label: header,
      column: vm.report.col_order[columnNumber],
      checked: false,
    };
    if (columnNumber <= 5) {
      headerObject.checked = true;
      vm.selectedHeaderFields.push(headerObject);
    }

    vm.headerOptions.push(headerObject);
  });

  function checkboxChange() {
    vm.selectedHeaderFields = lodash.filter(vm.headerOptions, { checked: true });
  }
}

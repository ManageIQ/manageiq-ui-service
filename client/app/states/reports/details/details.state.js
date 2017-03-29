/** @ngInject */
export function ReportsDetailsState(routerHelper, RBAC) {
  routerHelper.configureStates(getStates(RBAC));
}

function getStates(RBAC) {
  return {
    'reports.details': {
      url: '/:reportId',
      template: '<reports-details report="vm.report"></reports-details>',
      controller: StateController,
      controllerAs: 'vm',
      title: __('Reports Details'),
      resolve: {
        report: resolveReportDetails,
      },
      data: {
        authorization: RBAC.hasAny(['miq_report_view']),
      },
    },
  };
}

/** @ngInject */
function resolveReportDetails($stateParams, CollectionsApi) {
  var options = {
    expand: ['resources'],
  };

  return CollectionsApi.get('reports', $stateParams.reportId, options);
}

/** @ngInject */
function StateController(report) {
  var vm = this;
  vm.report = report;
}

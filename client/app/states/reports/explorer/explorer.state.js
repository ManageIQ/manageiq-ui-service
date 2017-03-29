/** @ngInject */
export function ReportsExplorerState(routerHelper, RBAC) {
  routerHelper.configureStates(getStates(RBAC));
}

function getStates(RBAC) {
  return {
    'reports.explorer': {
      url: '',
      template: '<reports-explorer></reports-explorer>',
      title: __('Reports'),
      data: {
        authorization: RBAC.hasAny(['miq_report_view']),
      },  
    },
  };
}

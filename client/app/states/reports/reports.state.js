/** @ngInject */
export function ReportsState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'reports': {
      parent: 'application',
      url: '/reports',
      redirectTo: 'reports.explorer',
      template: '<ui-view></ui-view>',
    },
  };
}

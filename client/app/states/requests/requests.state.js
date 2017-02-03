/** @ngInject */
export function RequestsState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'requests': {
      parent: 'application',
      url: '/requests',
      redirectTo: 'requests.explorer',
      template: '<ui-view></ui-view>',
    },
  };
}

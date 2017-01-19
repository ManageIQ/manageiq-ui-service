/** @ngInject */
export function ProductsState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'products': {
      url: '/',
      redirectTo: 'marketplace',
      template: '<ui-view></ui-view>',
    },
  };
}

/** @ngInject */
export function MarketplaceState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'marketplace': {
      parent: 'application',
      url: '/marketplace',
      redirectTo: 'marketplace.list',
      template: '<ui-view></ui-view>',
    },
  };
}

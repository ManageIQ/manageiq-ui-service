/** @ngInject */
export function OrdersState (routerHelper) {
  routerHelper.configureStates(getStates())
}

function getStates () {
  return {
    'orders': {
      parent: 'application',
      url: '/orders',
      redirectTo: 'orders.explorer',
      template: '<ui-view></ui-view>'
    }
  }
}

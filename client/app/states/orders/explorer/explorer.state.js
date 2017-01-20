/** @ngInject */
export function OrdersExplorerState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
    return {
      'orders.explorer': {
        url: '',
        template: '<order-explorer></order-explorer>',
        title: N_('My Orders'),
      },
    };
  }

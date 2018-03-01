/** @ngInject */
export function OrdersExplorerState (routerHelper, RBAC) {
  routerHelper.configureStates(getStates(RBAC))
}

function getStates (RBAC) {
  return {
    'orders.explorer': {
      url: '',
      template: '<order-explorer></order-explorer>',
      title: __('My Orders'),
      data: {
        authorization: RBAC.hasAny(['miq_request_show', 'miq_request_show_list'])
      }
    }
  }
}

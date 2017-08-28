/** @ngInject */
export function ServicesExplorerState (routerHelper, RBAC) {
  routerHelper.configureStates(getStates(RBAC))
}

function getStates (RBAC) {
  return {
    'services.explorer': {
      url: '',
      template: '<service-explorer></service-explorer>',
      controllerAs: 'vm',
      title: __('Services Explorer'),
      params: { filter: null },
      data: {
        authorization: RBAC.hasAny(['service_view'])
      }
    }
  }
}

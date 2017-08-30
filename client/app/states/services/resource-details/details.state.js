/** @ngInject */
export function VmsDetailsState (routerHelper) {
  routerHelper.configureStates(getStates())
}

function getStates () {
  return {
    'services.resource-details': {
      url: '/:vmId',
      params: { viewType: null },
      template: '<vm-details>',
      title: N_('Resource Details')
    }
  }
}

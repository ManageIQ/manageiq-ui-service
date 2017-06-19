/** @ngInject */
export function VmsDetailsState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'vms.details': {
      url: '/:vmId',
      params: { viewType: null },
      template: '<vm-details \>',
      title: N_('VM Details'),
    },
  };
}

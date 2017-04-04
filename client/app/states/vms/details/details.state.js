/** @ngInject */
export function VmsDetailsState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'vms.details': {
      url: '/:vmId',
      template: '<vm-details \>',
      title: N_('VM Details'),
    },
  };
}

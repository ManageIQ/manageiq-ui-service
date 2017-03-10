/** @ngInject */
export function ServicesDetailsState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'services.details': {
      url: '/:serviceId',
      template: '<service-details service-id="vm.serviceId"></service-details>',
      controllerAs: 'vm',
      title: N_('Service Details'),
    },
  };
}

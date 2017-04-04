/** @ngInject */
export function ServicesDetailsState(routerHelper, RBAC) {
  routerHelper.configureStates(getStates(RBAC));
}

function getStates(RBAC) {
  return {
    'services.details': {
      url: '/:serviceId',
      template: '<service-details></service-details>',
      controllerAs: 'vm',
      title: __('Service Details'),
      data: {
        authorization: RBAC.hasAny(['service_view']),
      },
    },
  };
}

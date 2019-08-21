/** @ngInject */
export function VmsDetailsState (routerHelper, RBAC) {
  routerHelper.configureStates(getStates(RBAC))
}

function getStates (RBAC) {
  return {
    'services.resource-details': {
      url: '/:serviceId/resource=:vmId',
      template: '<resource-details>',
      title: __('Resource Details'),
      data: {
        authorization: RBAC.has(RBAC.FEATURES.VMS.VIEW)
      }
    }
  }
}

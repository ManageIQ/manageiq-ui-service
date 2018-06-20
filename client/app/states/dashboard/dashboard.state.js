/** @ngInject */
export function DashboardState (routerHelper, RBAC) {
  routerHelper.configureStates(getStates(RBAC))
}

function getStates (RBAC) {
  return {
    'dashboard': {
      parent: 'application',
      url: '/',
      template: `<dashboard-component>`,
      title: __('Dashboard'),
      data: {
        authorization: RBAC.has(RBAC.FEATURES.DASHBOARD.VIEW)
      }
    }
  }
}

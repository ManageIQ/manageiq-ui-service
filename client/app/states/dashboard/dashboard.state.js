/** @ngInject */
export function DashboardState (routerHelper) {
  routerHelper.configureStates(getStates())
}

function getStates () {
  return {
    'dashboard': {
      parent: 'application',
      url: '/',
      template: `<dashboard-component>`,
      title: __('Dashboard'),
      data: {
        requireUser: true
      }
    }
  }
}

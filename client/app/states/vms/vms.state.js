/** @ngInject */
export function VmsState (routerHelper) {
  routerHelper.configureStates(getStates())
}

function getStates () {
  return {
    'vms': {
      parent: 'application',
      url: '/vms',
      redirectTo: 'services.explorer',
      template: '<ui-view></ui-view>'
    }
  }
}

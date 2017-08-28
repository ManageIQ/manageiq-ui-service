/** @ngInject */
export function CatalogsState (routerHelper) {
  routerHelper.configureStates(getStates())
}

function getStates () {
  return {
    'catalogs': {
      parent: 'application',
      url: '/catalogs',
      redirectTo: 'catalogs.explorer',
      template: '<ui-view></ui-view>'
    }
  }
}

/** @ngInject */
export function BlueprintsState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'designer.blueprints': {
      parent: 'application',
      url: '/blueprints',
      redirectTo: 'designer.blueprints.list',
      template: '<ui-view></ui-view>',
    },
  };
}

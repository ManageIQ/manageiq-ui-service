/** @ngInject */
export function TemplatesState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'templates': {
      parent: 'application',
      url: '/templates',
      redirectTo: 'templates.explorer',
      template: '<ui-view></ui-view>',
    },
  };
}

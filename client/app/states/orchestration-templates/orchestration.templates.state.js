/** @ngInject */
export function OrchestrationTemplatesState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'orchestration-templates': {
      parent: 'application',
      url: '/orchestration-templates',
      redirectTo: 'orchestration-templates.explorer',
      template: '<ui-view></ui-view>',
    },
  };
}

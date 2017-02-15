/** @ngInject */
export function OrchestrationTemplatesExplorerState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'orchestration-templates.explorer': {
      url: '',
      template: '<orchestration-template-explorer></orchestration-template-explorer>',
      title: N_('Orchestration Templates'),
    },
  };
}

/** @ngInject */
export function TemplatesExplorerState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'templates.explorer': {
      url: '',
      template: '<template-explorer></template-explorer>',
      title: N_('Templates'),
    },
  };
}

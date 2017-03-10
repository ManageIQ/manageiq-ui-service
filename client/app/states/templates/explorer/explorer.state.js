/** @ngInject */
export function TemplatesExplorerState(routerHelper, RBAC) {
  routerHelper.configureStates(getStates(RBAC));
}

function getStates(RBAC) {
  return {
    'templates.explorer': {
      url: '',
      template: '<template-explorer></template-explorer>',
      title: N_('Templates'),
      data: {
        authorization: RBAC.hasAny(['orchestration_templates_admin', 'orchestration_templates_view']),
      },
    },
  };
}

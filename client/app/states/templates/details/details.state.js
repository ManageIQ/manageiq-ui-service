/** @ngInject */

export function TemplatesDetailsState(routerHelper, RBAC) {
  routerHelper.configureStates(getStates(RBAC));
}

function getStates(RBAC) {
  return {
    'templates.details': {
      url: '/details/:templateId',
      template: '<template-editor existing-template="vm.template" page-action="vm.pageAction" ></template-editor>',
      controller: StateController,
      controllerAs: 'vm',
      resolve: {
        template: resolveTemplate,
      },
      data: {
        authorization: RBAC.hasAny(['orchestration_templates_admin', 'orchestration_templates_view']),
      },
    },
  };
}

/** @ngInject */
function resolveTemplate($stateParams, TemplatesService) {
  return $stateParams.templateId ? TemplatesService.getTemplate($stateParams.templateId) : {};
}

/** @ngInject */
function StateController(template) {
  var vm = this;
  vm.template = template;
  vm.pageAction = 'view';
}

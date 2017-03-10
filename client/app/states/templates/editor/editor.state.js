/** @ngInject */

export function TemplatesEditorState(routerHelper, RBAC) {
  routerHelper.configureStates(getStates(RBAC));
}

function getStates(RBAC) {
  return {
    'templates.editor': {
      url: '/:pageAction/:templateId',
      template: '<template-editor existing-template="vm.template" page-action="vm.pageAction"></template-editor>',
      controller: StateController,
      controllerAs: 'vm',
      resolve: {
        template: resolveTemplate,
      },
      data: {
        authorization: RBAC.hasAny(['orchestration_templates_admin', 'orchestration_templates_edit']),
      },
    },
  };
}

/** @ngInject */
function resolveTemplate($stateParams, TemplatesService) {
  return $stateParams.templateId ? TemplatesService.getTemplate($stateParams.templateId) : {};
}

/** @ngInject */
function StateController($stateParams, template) {
  var vm = this;
  vm.pageAction = $stateParams.pageAction;
  if ($stateParams.templateId) {
    vm.template = template;
  }
}

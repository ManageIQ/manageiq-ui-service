/** @ngInject */

export function TemplatesCopyState(routerHelper) {
  const state = {
    'templates.copy': {
      url: '/copy/:templateId',
      template: '<template-editor existing-template="vm.template" page-action="Copy"></template-editor>',
      controller: StateController,
      controllerAs: 'vm',
      resolve: {
        template: resolveTemplate,
      },
    },
  };
  routerHelper.configureStates(state);
}

/** @ngInject */
function resolveTemplate($stateParams, TemplatesService) {
  return $stateParams.templateId ? TemplatesService.getTemplate($stateParams.templateId) : {};
}

/** @ngInject */
function StateController(template) {
  var vm = this;
  vm.template = template;
}

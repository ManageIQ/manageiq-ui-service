/** @ngInject */

export function TemplatesCopyState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
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

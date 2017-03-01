/** @ngInject */

export function TemplatesDetailsState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'templates.details': {
      url: '/details/:templateId',
      template: '<template-editor existing-template="vm.template" page-action="View" ></template-editor>',
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

/** @ngInject */

export function TemplatesEditorState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'templates.editor': {
      url: '/:pageAction/:templateId',
      template: '<template-editor existing-template="vm.template" page-action="vm.pageAction"></template-editor>',
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
function StateController($stateParams, template) {
  var vm = this;
  vm.pageAction = $stateParams.pageAction;
  if ($stateParams.templateId) {
    vm.template = template;
  }
}

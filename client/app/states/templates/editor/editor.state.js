import templateUrl from './editor.html';
/** @ngInject */

export function TemplatesEditorState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'templates.editor': {
      url: '/edit/:templateId',
      templateUrl,
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
  if ($stateParams.templateId) {
    return TemplatesService.getTemplate($stateParams.templateId);
  }

  return {};
}

/** @ngInject */
function StateController($stateParams, template) {
  var vm = this;
  if ($stateParams.templateId) {
    vm.title = 'Edit Template';
    vm.template = template;
  } else {
    vm.title = 'Add Template';
  }
}

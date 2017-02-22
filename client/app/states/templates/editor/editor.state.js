/* eslint camelcase: "off" */

/** @ngInject */
export function TemplatesEditorState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'templates.editor': {
      url: '/edit/:templateId',
      templateUrl: 'app/states/templates/editor/editor.html',
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
  } else {
    return {};
  }
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

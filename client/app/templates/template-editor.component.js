/* eslint camelcase: "off" */
import './_template-editor.sass';
import templateUrl from './template-editor.html';

export const TemplateEditorComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  templateUrl,
  bindings: {
    template: "<",
  },
};

/** @ngInject */
function ComponentController( $state, TemplatesService, EventNotifications, lodash) {
  const vm = this;

  vm.$onInit = activate();

  function activate() {
    const templateTypes = [
      {
        "label": "Amazon Cloudformation",
        "value": "OrchestrationTemplateCfn",
      },
      {
        "label": "Openstack Heat",
        "value": "OrchestrationTemplateHot",
      },
      {
        "label": "Microsoft Azure",
        "value": "OrchestrationTemplateAzure",
      },
      {
        "label": "VNF",
        "value": "OrchestrationTemplateVnfd",
      },
    ];

    angular.extend(vm, {
      saveTemplate: saveTemplate,
      templateTypes: templateTypes,
      templateTypeValue: '',
      cancelChanges: cancelChanges,
      isPristine: isPristine,
    });
    if (!vm.template) {
      vm.template = {
        name: '',
        type: '',
        description: '',
        content: '',
        orderable: false,
        draft: true,
      };
    } else {
      vm.templateTypeValue = lodash.find(templateTypes, { value: vm.template.type });
    }
  }

  function saveTemplate() {
    if (!vm.template.id) {
      vm.template.type = vm.templateTypeValue.value;
      TemplatesService.createTemplate(vm.template).then(createSuccess, createFailure);
    }
    function createSuccess(data) {
      $state.go('templates.explorer');
    }
    function createFailure(data) {
      EventNotifications.error(__("There was an error creating the template"));
    }
  }
  function isPristine() {
    if (!vm.template.name || !vm.templateTypeValue) {
      return false;
    }

    return true;
  }
  function cancelChanges() {
    $state.go('templates');
  }
}

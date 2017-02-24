/* eslint camelcase: "off" */
import './_template-editor.sass';
import templateUrl from './template-editor.html';

export const TemplateEditorComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  templateUrl,
  bindings: {
    existingTemplate: "<?",
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
    const defaultTemplate = {
      name: '',
      type: '',
      description: '',
      content: '',
      orderable: true,
      draft: true,
    };

    angular.extend(vm, {
      saveTemplate: saveTemplate,
      templateTypes: templateTypes,
      templateTypeValue: '',
      cancelChanges: cancelChanges,
    });
    vm.template = setupTemplate(templateTypes, defaultTemplate);
  }

  function setupTemplate(templateTypes, defaultTemplate) {
    if (vm.existingTemplate) {
      vm.templateTypeValue = lodash.find(templateTypes, { value: vm.existingTemplate.type });

      return {
        name: vm.existingTemplate.name,
        type: vm.existingTemplate.type,
        description: vm.existingTemplate.description,
        content: vm.existingTemplate.content,
        orderable: vm.existingTemplate.orderable,
        draft: vm.existingTemplate.draft,
        id: vm.existingTemplate.id,
      };
    }

    return defaultTemplate;
  }
  function saveTemplate() {
    vm.template.type = vm.templateTypeValue.value;

    if (vm.existingTemplate) {
      TemplatesService.updateTemplate(vm.template).then(changesSuccessful, changesFailed);
    } else {
      TemplatesService.createTemplate(vm.template).then(createSuccessful, createFailure);
    }
    function createSuccessful(_data) {
      $state.go('templates.explorer');
    }
    function changesSuccessful(_data) {
      EventNotifications.success(__("Templated updated"));
    }
    function changesFailed(_data) {
      EventNotifications.error(__("There was an error updating the template"));
    }
    function createFailure(_data) {
      EventNotifications.error(__("There was an error creating the template"));
    }
  }

  function cancelChanges() {
    $state.go('templates');
  }
}

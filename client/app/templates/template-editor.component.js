/* eslint camelcase: "off" */
import './_template-editor.sass';
import templateUrl from './template-editor.html';

export const TemplateEditorComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  templateUrl,
  bindings: {
    existingTemplate: "<?",
    pageAction: "@",
  },
};

/** @ngInject */
function ComponentController($state, sprintf, TemplatesService, EventNotifications, lodash, FileSaver, Blob) {
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
    vm.title = __(vm.pageAction + ' Template');

    angular.extend(vm, {
      saveTemplate: saveTemplate,
      templateTypes: templateTypes,
      templateTypeValue: '',
      cancelChanges: cancelChanges,
      listActions: getListActions(),
      headerConfig: getHeaderConfig(),
      downloadTemplate: downloadTemplate,
      editingEnabled: configEditing(),
      removeTemplate: removeTemplate,
      confirmDelete: false,
      cancelRemoveTemplate: cancelRemoveTemplate,
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

  function getListActions() {
    var listActions = [];

    listActions.push(
      {
        title: __('Configuration'),
        actionName: 'configuration',
        icon: 'fa fa-cog',
        actions: [
          {
            name: __('Edit'),
            actionName: 'edit',
            title: __('Edit Template'),
            actionFn: handleEdit,
          }, {
            name: __('Delete'),
            actionName: 'delete',
            title: __('Delete Template'),
            actionFn: handleDelete,
          },
        ],
        isDisabled: false,
      }
    );

    return listActions;
  }
  function getHeaderConfig() {
    return {
      actionsConfig: {
        actionsInclude: true,
      },
    };
  }
  function configEditing() {
    if (vm.pageAction !== 'View') {
      return true;
    }

    return false;
  }
  function handleEdit(_action) {
    $state.go('templates.editor', { templateId: vm.template.id });
  }
  function downloadTemplate() {
    const data = new Blob([vm.template.content], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(data, 'template.txt');
  }
  function removeTemplate() {
    const templatesToDelete = [];
    templatesToDelete.push({'id': vm.template.id});
    TemplatesService.deleteTemplates(templatesToDelete).then(removeSuccess,
      removeFailure);

    vm.confirmDelete = false;

    function removeSuccess() {
      EventNotifications.success(__('Template deleted successfully.'));
    }

    function removeFailure() {
      EventNotifications.error(__('There was an error deleting the template.'));
    }
  }
  function handleDelete(_action) {
    vm.templateToDelete = vm.template;
    vm.confirmDelete = true;
    vm.deleteConfirmationMessage = sprintf(__('Are you sure you want to delete template %s?'),
      vm.templateToDelete.name);
  }

  function cancelRemoveTemplate() {
    vm.confirmDelete = false;
    vm.templateToDelete = {};
  }
}

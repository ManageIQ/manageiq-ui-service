/* eslint camelcase: ["error", {properties: "never"}] */

/** @ngInject */
export function DialogsEditState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'dialogs.edit': {
      url: '/edit/:dialogId',
      templateUrl: 'app/states/dialogs/edit/edit.html',
      controller: StateController,
      controllerAs: 'vm',
      title: N_('Dialog Editing'),
      resolve: {
        dialog: resolveDialog,
      },
    },
  };
}

/** @ngInject */
function resolveDialog($stateParams, CollectionsApi) {
  var options = {attributes: ['content', 'buttons', 'label']};

  if ($stateParams.dialogId === 'new') {
    return {
      "content": [{
        "dialog_tabs": [{
          "label": "New tab",
          "position": 0,
          "dialog_groups": [
          ],
        }],
      }],
    };
  }

  return CollectionsApi.get('service_dialogs', $stateParams.dialogId, options);
}

/** @ngInject */
function StateController($state, dialog, DialogEditor, CollectionsApi,
         EventNotifications, lodash) {
  var vm = this;

  DialogEditor.setData(dialog);

  vm.dialog = dialog;
  vm.saveDialogDetails = saveDialogDetails;
  vm.dismissChanges = dismissChanges;

  function dismissChanges() {
    if (angular.isUndefined(dialog.id)) {
      $state.go('dialogs.list');
    } else {
      $state.go('dialogs.details', {dialogId: dialog.id});
    }
  }

  function saveDialogDetails() {
    var action, dialogData;

    // load dialog data
    if (angular.isUndefined(DialogEditor.getDialogId())) {
      action = 'create';
      dialogData = {
        description: DialogEditor.getDialogDescription(),
        label: DialogEditor.getDialogLabel(),
        dialog_tabs: [],
      };
      lodash.cloneDeep(DialogEditor.getDialogTabs()).forEach(function(tab) {
        delete tab.active;
        dialogData.dialog_tabs.push(tab);
      });
    } else {
      action = 'edit';
      dialogData = {
        description: DialogEditor.getDialogDescription(),
        label: DialogEditor.getDialogLabel(),
        content: {
          dialog_tabs: [],
        },
      };
      lodash.cloneDeep(DialogEditor.getDialogTabs()).forEach(function(tab) {
        delete tab.active;
        dialogData.content.dialog_tabs.push(tab);
      });
    }

    // save the dialog
    CollectionsApi.post(
      'service_dialogs',
      DialogEditor.getDialogId(),
      {},
      angular.toJson({action: action, resource: dialogData})
    ).then(saveSuccess, saveFailure);
  }

  function saveSuccess() {
    EventNotifications.success(vm.dialog.content[0].label + __(' was saved'));
    $state.go('dialogs.list');
  }

  function saveFailure() {
    EventNotifications.error(__('There was an error editing this dialog.'));
  }
}

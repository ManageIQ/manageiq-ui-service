/* eslint camelcase: ["error", {properties: "never"}] */

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'designer.dialogs.edit': {
        url: '/edit/:dialogId',
        templateUrl: 'app/states/designer/dialogs/edit/edit.html',
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
  function StateController($state, dialog, DialogEditor, CollectionsApi, EventNotifications) {
    var vm = this;

    DialogEditor.setData(dialog);

    vm.dialog = dialog;
    vm.saveDialogDetails = saveDialogDetails;
    vm.dismissChanges = dismissChanges;
    vm.dialogUnchanged = dialogUnchanged;

    function dismissChanges() {
      if (angular.isUndefined(dialog.id)) {
        $state.go('designer.dialogs.list');
      } else {
        $state.go('designer.dialogs.details', {dialogId: dialog.id});
      }
    }

    function saveDialogDetails() {
      // load dialog data
      if (angular.isUndefined(DialogEditor.getDialogId())) {
        var action = 'create';
        var dialogData = {
          description: DialogEditor.getDialogDescription(),
          label: DialogEditor.getDialogLabel(),
          dialog_tabs: [],
        };
        DialogEditor.getDialogTabs().forEach(function(tab) {
          delete tab.active;
          dialogData.dialog_tabs.push(tab);
        });
      } else {
        var action = 'edit';
        var dialogData = {
          description: DialogEditor.getDialogDescription(),
          label: DialogEditor.getDialogLabel(),
          content: {
            dialog_tabs: [],
          }
        };
        DialogEditor.getDialogTabs().forEach(function(tab) {
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

    function dialogUnchanged() {
      // TODO:
    }

    function saveSuccess() {
      EventNotifications.success(vm.dialog.content[0].label + __(' was saved'));
      $state.go('designer.dialogs.list');
    }

    function saveFailure() {
      EventNotifications.error(__('There was an error editing this dialog.'));
    }
  }
})();

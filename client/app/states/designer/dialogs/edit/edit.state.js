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
  function StateController($state, dialog, DialogEditor, CollectionsApi, Notifications) {
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
      var dialogData = {
        description: DialogEditor.getData().content[0].description,
        label: DialogEditor.getData().content[0].label,
        dialog_tabs: [],
      };
      DialogEditor.getData().content[0].dialog_tabs.forEach(function(tab) {
        delete tab.active;
        dialogData.dialog_tabs.push(tab);
      });

      // save the dialog
      CollectionsApi.post(
        'service_dialogs',
        DialogEditor.getData().id,
        {},
        angular.toJson({action: 'create', resource: dialogData})
      ).then(saveSuccess, saveFailure);
    }

    function dialogUnchanged() {
      // TODO:
    }

    function saveSuccess() {
      Notifications.success(vm.dialog.content[0].label + __(' was saved'));
      $state.go('designer.dialogs.list');
    }

    function saveFailure() {
      Notifications.error(__('There was an error editing this dialog.'));
    }
  }
})();

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
      'dialogs.edit': {
        url: '/edit/:dialogId',
        templateUrl: 'app/states/dialogs/edit/edit.html',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('Dialog Editing'),
        resolve: {
          dialog: resolveDialog
        }
      }
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
            ]
          }]
        }]
      };
    }

    return CollectionsApi.get('service_dialogs', $stateParams.dialogId, options);
  }

  /** @ngInject */
  function StateController($state, dialog, DialogEdit, CollectionsApi, Notifications) {
    var vm = this;

    DialogEdit.setData(dialog);

    vm.dialog = dialog;
    vm.saveDialogDetails = saveDialogDetails;
    vm.dismissChanges = dismissChanges;
    vm.dialogUnchanged = dialogUnchanged;

    function dismissChanges() {
      $state.go('dialogs.details', {dialogId: dialog.id});
    }

    function saveDialogDetails() {
      // load dialog data
      var dialogData = {
        description: DialogEdit.getData().content[0].description,
        label: DialogEdit.getData().content[0].label,
        dialog_tabs: [],
      };
      DialogEdit.getData().content[0].dialog_tabs.forEach(function(tab) {
        delete tab.active
        dialogData.dialog_tabs.push(tab);
      });

      // save the dialog
      CollectionsApi.post(
        'service_dialogs',
        DialogEdit.getData().id,
        {},
        angular.toJson({action: 'create', resource: dialogData})
      ).then(saveSuccess, saveFailure);
    }

    function dialogUnchanged() {
      // TODO:
    }

    function saveSuccess() {
      Notifications.success(vm.dialog.content[0].label + __(' was saved'));
      $state.go('dialogs.list');
    }

    function saveFailure() {
      Notifications.error(__('There was an error editing this dialog.'));
    }
  }
})();

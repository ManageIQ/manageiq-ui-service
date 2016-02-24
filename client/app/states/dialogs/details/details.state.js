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
      'dialogs.details': {
        url: '/:dialogId',
        templateUrl: 'app/states/dialogs/details/details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('Dialog Detail'),
        resolve: {
          dialog: resolveDialog
        }
      }
    };
  }

  /** @ngInject */
  function resolveDialog($stateParams, CollectionsApi) {
    var options = {};

    return CollectionsApi.get('service_dialogs', $stateParams.dialogId, options);
  }

  /** @ngInject */
  function StateController($state, dialog, CollectionsApi, Notifications) {
    var vm = this;

    vm.dialog = dialog;
    vm.dialog.performAction = performAction;
    vm.dialog.removeDialog = removeDialog;

    function performAction(item) {
      $state.go('dialogs.edit', {dialogId: dialog.id});
    }

    function removeDialog() {
      var removeAction = {action: 'delete'};
      CollectionsApi.post('service_dialogs', vm.dialog.id, {}, removeAction).then(removeSuccess, removeFailure);

      function removeSuccess() {
        Notifications.success(vm.dialog.name + __(' was removed.'));
        $state.go('dialogs.list');
      }

      function removeFailure(data) {
        Notifications.error(__('There was an error removing this dialog.'));
      }
    }
  }
})();

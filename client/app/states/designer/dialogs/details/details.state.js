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
      'designer.dialogs.details': {
        url: '/:dialogId',
        templateUrl: 'app/states/designer/dialogs/details/details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('Dialog Detail'),
        resolve: {
          dialog: resolveDialog,
        },
      },
    };
  }

  /** @ngInject */
  function resolveDialog($stateParams, CollectionsApi) {
    var options = {};

    return CollectionsApi.get('service_dialogs', $stateParams.dialogId, options);
  }

  /** @ngInject */
  function StateController($state, dialog, CollectionsApi, EventNotifications) {
    var vm = this;

    vm.dialog = dialog;
    vm.dialog.performAction = performAction;
    vm.dialog.removeDialog = removeDialog;

    function performAction(item) {
      $state.go('designer.dialogs.edit', {dialogId: dialog.id});
    }

    function removeDialog() {
      var removeAction = {action: 'delete'};
      CollectionsApi.post('service_dialogs', vm.dialog.id, {}, removeAction).then(removeSuccess, removeFailure);

      function removeSuccess() {
        EventNotifications.success(vm.dialog.label + __(' was removed.'));
        $state.go('designer.dialogs.list');
      }

      function removeFailure(data) {
        EventNotifications.error(__('There was an error removing this dialog.'));
      }
    }
  }
})();

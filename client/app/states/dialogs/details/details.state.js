/** @ngInject */
export function DialogsDetailState(routerHelper) {
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
        dialog: resolveDialog,
      },
    },
  };
}

/** @ngInject */
function resolveDialog($stateParams, CollectionsApi) {
  return CollectionsApi.get('service_dialogs', $stateParams.dialogId, {});
}

/** @ngInject */
function StateController($state, dialog, CollectionsApi, EventNotifications, sprintf) {
  const vm = this;

  angular.extend(vm, {
    dialog: dialog,
    editDialog: editDialog,
    deleteDialog: dialogAction('delete'),
    copyDialog: dialogAction('copy'),
  });

  function editDialog() {
    $state.go('dialogs.edit', {dialogId: vm.dialog.id});
  }

  function dialogAction(action) {
    return function() {
      const actionData = {action: action};
      CollectionsApi.post('service_dialogs', vm.dialog.id, {}, actionData)
        .then(actionSuccess, actionFailure);

      function actionSuccess() {
        let actionString;
        if (action === 'copy') {
          actionString = sprintf(__('%s was copied.'), vm.dialog.label);
        } else {
          actionString = sprintf(__('%s was deleted.'), vm.dialog.label);
        }
        EventNotifications.success(actionString);
        $state.go('dialogs.list');
      }

      function actionFailure() {
        if (action === 'copy') {
          EventNotifications.error(__('There was an error copying this dialog.'));
        } else {
          EventNotifications.error(__('There was an error deleting this dialog.'));
        }
      }
    };
  }
}

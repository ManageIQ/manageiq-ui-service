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
  function StateController(dialog) {
    var vm = this;

    vm.dialog = dialog;
  }
})();

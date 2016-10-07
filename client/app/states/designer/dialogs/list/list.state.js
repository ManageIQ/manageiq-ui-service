/* eslint camelcase: "off" */
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
      'designer.dialogs.list': {
        url: '', // No url, this state is the index of dialogs
        templateUrl: 'app/states/designer/dialogs/list/list.html',
        controller: DialogsController,
        controllerAs: 'vm',
        title: N_('Dialog List'),
        resolve: {
          dialogs: resolveDialogs,
        },
      },
    };
  }

  /** @ngInject */
  function resolveDialogs(CollectionsApi) {
    var options = {
      expand: 'resources',
      attributes: 'bundle',
    };

    return CollectionsApi.query('service_dialogs', options);
  }

  /** @ngInject */
  function DialogsController(dialogs) {
    var vm = this;
    vm.dialogs = dialogs.resources;
  }
})();

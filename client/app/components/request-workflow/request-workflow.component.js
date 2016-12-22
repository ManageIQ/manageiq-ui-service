(function() {
  'use strict';

  angular.module('app.components')
    .component('requestWorkflow', {
      bindings: {
        workflow: '=?',
      },
      controller: requestWorkflowController,
      controllerAs: 'vm',
      templateUrl: 'app/components/request-workflow/request-workflow.html',
    });

  /** @ngInject */
  function requestWorkflowController(API_BASE, lodash) {
    var vm = this;
    vm.$onInit = activate;

    vm.API_BASE = API_BASE;

    function activate() {
    }

    // Private functions
  }
})();

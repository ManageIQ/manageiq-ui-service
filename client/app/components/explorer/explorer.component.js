(function() {
  'use strict';

  angular.module('app.components')
    .component('explorer', {
      controller: ComponentController,
      controllerAs: 'vm',
      bindings: {

      },
      templateUrl: 'app/components/explorer/explorer.html',
    });

  /** @ngInject */
  function ComponentController() {
    var vm = this;
    vm.$onInit = activate();

    function activate() {
    }
  }
})();

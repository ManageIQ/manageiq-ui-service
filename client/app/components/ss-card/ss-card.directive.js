(function() {
  'use strict';

  angular.module('app.components')
    .component('ssCard',
      {
      controller: ComponentController,
      controllerAs: 'vm',
      bindings: {
        title: '@heading',
        description: '@',
        more: '@',
        img: '@?',
      },
      templateUrl: 'app/components/ss-card/ss-card.html',
    });

  /** @ngInject */
  function ComponentController() {
    var vm = this;
    vm.$onInit = activate();

    function activate() {
    }
  }
})();

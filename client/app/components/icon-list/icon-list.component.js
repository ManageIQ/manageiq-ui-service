(function() {
  'use strict';

  angular.module('app.components')
    .component('iconList', {
      controller: ComponentController,
      controllerAs: 'vm',
      bindings: {
        items: '<',
      },
      templateUrl: 'app/components/icon-list/icon-list.html',
    });

  /** @ngInject */
  function ComponentController() {
    var vm = this;

    angular.extend(vm, {

    });

    vm.$onInit = function() {
    };

    vm.$onChanges = function(changes) {
    };


    // Public

    // Private

  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .component('customDropdown', {
      controller: ComponentController,
      controllerAs: 'vm',
      bindings: {
        config: '<'
      },
      templateUrl: 'app/components/custom-dropdown/custom-dropdown.html',
    });

  /** @ngInject */
  function ComponentController() {
    var vm = this;
    angular.extend(vm, {
      handleAction: handleAction,
    });

    vm.$onInit = function() {

    };

    vm.$onChanges = function(changes) {

    };


    // Public

    // Private
    function handleAction(option) {
      if (!option.isDisabled) {
        option.actionFn();
      }
    }

  }
})();

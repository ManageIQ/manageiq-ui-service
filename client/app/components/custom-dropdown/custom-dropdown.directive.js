(function() {
  'use strict';

  angular.module('app.components')
    .component('customDropdown', {
      controller: ComponentController,
      controllerAs: 'vm',
      bindings: {
        config: '<',
        items: '<',
        itemsCount: '<',
        onUpdate: '&',
        menuRight: '@',
      },
      templateUrl: 'app/components/custom-dropdown/custom-dropdown.html',
    });

  /** @ngInject */
  function ComponentController() {
    var vm = this;

    vm.$onInit = function() {
      vm.menuRight = vm.menuRight && (vm.menuRight === 'true' || vm.menuRight === true);

      angular.extend(vm, {
        handleAction: handleAction,
      });
    };

    vm.$onChanges = function() {
      updateDisabled();
    };
    // Public

    // Private
    function updateDisabled() {
      vm.onUpdate({$config: vm.config, $changes: vm.items});
    }

    function handleAction(option) {
      if (!option.isDisabled) {
        option.actionFn(option);
      }
    }
  }
})();

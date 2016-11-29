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
      },
      templateUrl: 'app/components/custom-dropdown/custom-dropdown.html',
    });

  /** @ngInject */
  function ComponentController() {
    const vm = this;

    angular.extend(vm, {
      handleAction: handleAction,
    });

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

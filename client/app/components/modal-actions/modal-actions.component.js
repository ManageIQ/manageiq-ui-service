(function() {
  'use strict';

  angular.module('app.components')
    .component('modalActions', {
      controller: ComponentController,
      controllerAs: 'vm',
      bindings: {
        modalData: '<?',
        onCancel: '&',
        onReset: '&',
        onSave: '&',
      },
      templateUrl: 'app/components/modal-actions/modal-actions.html',
    });

  /** @ngInject */
  function ComponentController() {
    var vm = this;
    vm.isPristine = isPristine;
    vm.cancelAction = cancelAction;
    vm.emitOriginal = emitOriginal;
    vm.saveResource = saveResource;

    vm.$onInit = function() {
      vm.original = angular.copy(vm.modalData);
    };

    function cancelAction() {
      vm.onCancel();
    }

    function isPristine() {
      return angular.equals(vm.modalData, vm.original);
    }

    function emitOriginal() {
      vm.onReset({
        $event: {
          original: vm.original,
        },
      });
    }

    function saveResource() {
      vm.onSave();
    }
  }
})();

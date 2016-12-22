(function() {
  'use strict';

  angular.module('app.components')
    .component('editServiceModal', {
      controller: ComponentController,
      controllerAs: 'vm',
      bindings: {
        resolve: '<',
        modalInstance: '<',
        close: '&',
        dismiss: '&',
      },
      templateUrl: 'app/components/edit-service-modal/edit-service-modal.html',
    });


  /** @ngInject */
  function ComponentController($controller, sprintf) {
    var vm = this;
    var base = $controller('BaseModalController', {
      $uibModalInstance: vm.modalInstance,
    });
    angular.extend(vm, base);

    vm.modalData = {
      id: vm.resolve.service.id,
      name: vm.resolve.service.name,
      description: vm.resolve.service.description,
    };

    vm.action = 'edit';
    vm.collection = 'services';
    vm.onSuccessMessage = sprintf(__("%s was edited."), vm.resolve.service.name);
    vm.onFailureMessage = __('There was an error editing this service.');
  }
})();

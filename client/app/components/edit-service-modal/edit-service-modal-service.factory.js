(function() {
  'use strict';

  angular.module('app.components')
    .factory('EditServiceModal', EditServiceFactory);

  /** @ngInject */
  function EditServiceFactory($uibModal) {
    var modalService = {
      showModal: showModal,
    };

    return modalService;

    function showModal(serviceDetails) {
      var modalOptions = {
        templateUrl: 'app/components/edit-service-modal/edit-service-modal.html',
        controller: EditServiceModalController,
        controllerAs: 'vm',
        size: 'lg',
        resolve: {
          serviceDetails: resolveServiceDetails,
        },
      };
      var modal = $uibModal.open(modalOptions);

      return modal.result;

      function resolveServiceDetails() {
        return serviceDetails;
      }
    }
  }

  /** @ngInject */
  function EditServiceModalController(serviceDetails, $controller, $uibModalInstance, sprintf) {
    var vm = this;
    var base = $controller('BaseModalController', {
      $uibModalInstance: $uibModalInstance,
    });
    angular.extend(vm, base);

    vm.modalData = {
      id: serviceDetails.id,
      name: serviceDetails.name,
      description: serviceDetails.description,
    };

    vm.action = 'edit';
    vm.collection = 'services';
    vm.onSuccessMessage = sprintf(__("%s was edited."), serviceDetails.name);
    vm.onFailureMessage = __('There was an error editing this service.');
  }
})();

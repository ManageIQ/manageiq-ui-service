(function() {
  'use strict';

  angular.module('app.components')
    .factory('CreateCatalogModal', CreateCatalogFactory);

  /** @ngInject */
  function CreateCatalogFactory($modal) {
    var modalOpen = false;
    var modalCreateCatalog = {
      showModal: showModal
    };

    return modalCreateCatalog;

    function showModal() {
      var modalOptions = {
        templateUrl: 'app/components/create-catalog-modal/create-catalog-modal.html',
        controller: CreateCatalogModalController,
        controllerAs: 'vm'
      };
      var modal = $modal.open(modalOptions);

      return modal.result;
    }
  }

  /** @ngInject */
  function CreateCatalogModalController($state, $modalInstance) {
    var vm = this;

    vm.modalData = {
        'catalogName': ''
    };

    vm.saveCatalog = saveCatalog;

    function saveCatalog() {

      saveSuccess();

      function saveSuccess() {
        if(vm.modalData.catalogName && vm.modalData.catalogName.length > 0) {
          $modalInstance.close({catalogName: vm.modalData.catalogName});
        } else {
          console.log("Catalog Name not provided.");
        }
      }

      function saveFailure() {
        console.log("Failed to save Catalog.");
      }
    }
  }
})();

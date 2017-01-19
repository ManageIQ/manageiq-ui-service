/** @ngInject */
export function CreateCatalogFactory($uibModal) {
  var modalCreateCatalog = {
    showModal: showModal,
  };

  return modalCreateCatalog;

  function showModal() {
    var modalOptions = {
      templateUrl: 'app/components/blueprints/blueprint-details-modal/create-catalog-modal/create-catalog-modal.html',
      controller: CreateCatalogModalController,
      controllerAs: 'vm',
    };
    var modal = $uibModal.open(modalOptions);

    return modal.result;
  }
}

/** @ngInject */
function CreateCatalogModalController($state, $uibModalInstance, $log) {
  var vm = this;

  vm.modalData = {
    'catalogName': '',
  };

  vm.saveCatalog = saveCatalog;

  function saveCatalog() {
    saveSuccess();

    function saveSuccess() {
      if (vm.modalData.catalogName && vm.modalData.catalogName.length > 0) {
        $uibModalInstance.close({catalogName: vm.modalData.catalogName});
      } else {
        $log.error("Catalog Name not provided.");
      }
    }
  }
}

import templateUrl from './process-snapshots-modal.html';

export const ProcessSnapshotsModalComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    resolve: '<',
    modalInstance: '<',
    close: '&',
    dismiss: '&',
  },
  templateUrl,
};

/** @ngInject */
function ComponentController($controller, VmsService, sprintf) {
  const vm = this;
  angular.extend(vm, $controller('BaseModalController', {
    $uibModalInstance: vm.modalInstance,
  }));

  angular.extend(vm, {
    modalData: {},
    vm: vm.resolve.vm,
    modalType: vm.resolve.modalType,
    save: save,
  });

  function save() {
    VmsService.createSnapshot(vm.modalData).then(success, failure);
  }

  function success(response) {

  }

  function failure(response) {

  }
}

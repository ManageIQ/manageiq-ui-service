export const ServiceDetailsAnsibleModalComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&',
  },
  templateUrl: 'app/components/services/service-details/service-details-ansible-modal.html',
};

/** @ngInject */
function ComponentController() {
  const vm = this;

  angular.extend(vm, {
    cancel: cancel,
  });

  function cancel() {
    vm.dismiss({$value: 'cancel'});
  }
}

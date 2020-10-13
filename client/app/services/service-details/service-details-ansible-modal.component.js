import template from './service-details-ansible-modal.html';

export const ServiceDetailsAnsibleModalComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  },
  template,
}

/** @ngInject */
function ComponentController () {
  const vm = this

  angular.extend(vm, {
    cancel: cancel
  })

  function cancel () {
    vm.dismiss({$value: 'cancel'})
  }
}

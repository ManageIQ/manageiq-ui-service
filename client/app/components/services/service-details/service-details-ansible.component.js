export const ServiceDetailsAnsibleComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    results: '<',
  },
  templateUrl: 'app/components/services/service-details/service-details-ansible.html',
};

/** @ngInject */
function ComponentController() {
  const vm = this;
  vm.$onInit = activate();

  function activate() {

  }

}

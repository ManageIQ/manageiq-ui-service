export const PowerStateComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    item: '=',
  },
  templateUrl: 'app/components/power-state/power-state.html',
};

/** @ngInject */
function ComponentController() {
  var vm = this;
  vm.$onInit = activate();

  function activate() {
  }
}

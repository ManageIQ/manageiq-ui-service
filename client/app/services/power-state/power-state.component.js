import './_power-state.sass';
import templateUrl from './power-state.html';

export const PowerStateComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    item: '=',
  },
  templateUrl,
};

/** @ngInject */
function ComponentController() {
  var vm = this;
  vm.$onInit = activate();

  function activate() {
  }
}

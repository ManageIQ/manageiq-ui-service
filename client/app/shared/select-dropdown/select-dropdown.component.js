import templateUrl from './select-dropdown.html';

export const SelectDropdownComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    model: "=",
    options: '<',
  },
  templateUrl,
};

/** @ngInject */
function ComponentController() {
  var vm = this;

  vm.$onInit = function() {

  };
}

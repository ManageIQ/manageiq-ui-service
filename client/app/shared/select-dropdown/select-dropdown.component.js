import templateUrl from './select-dropdown.html';

export const SelectDropdownComponent = {
  controllerAs: 'vm',
  bindings: {
    model: "=",
    options: '<',
    required: '<',
  },
  templateUrl,
};

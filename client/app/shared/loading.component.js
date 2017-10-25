export const LoadingComponent = {
  bindings: {
    status: '<'
  },
  controllerAs: 'vm',
  controller: function () {
    const vm = this
    vm.config = {icon: 'spinner spinner-lg spinner-inline', title: __('Loading')}
  },
  template:
    `
    <pf-empty-state ng-if="vm.status" config="vm.config"></pf-empty-state>
   `
}

export const IconListComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    items: '<',
  },
  templateUrl: 'app/components/icon-list/icon-list.html',
};

/** @ngInject */
function ComponentController() {
  var vm = this;
}

export const RequestListComponent = {
  bindings: {
    'items': '<',
    'config': '<?',
  },
  templateUrl: 'app/components/request-list/request-list.html',
  controller: ComponentController,
  controllerAs: 'vm',
};

/** @ngInject */
function ComponentController() {
}

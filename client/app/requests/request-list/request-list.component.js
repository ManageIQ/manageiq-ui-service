import templateUrl from './request-list.html';

export const RequestListComponent = {
  bindings: {
    'items': '<',
    'config': '<?',
  },
  templateUrl,
  controller: ComponentController,
  controllerAs: 'vm',
};

/** @ngInject */
function ComponentController() {
}

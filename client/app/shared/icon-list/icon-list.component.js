import './_icon-list.sass';
import templateUrl from './icon-list.html';

export const IconListComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    items: '<',
  },
  templateUrl,
};

/** @ngInject */
function ComponentController() {
  var vm = this;
}

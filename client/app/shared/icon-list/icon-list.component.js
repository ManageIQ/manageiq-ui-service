import './_icon-list.sass';
import templateUrl from './icon-list.html';

export const IconListComponent = {
  controllerAs: 'vm',
  bindings: {
    items: '<',
  },
  templateUrl,
};

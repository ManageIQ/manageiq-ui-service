import './_icon-list.sass'
import template from './icon-list.html';

export const IconListComponent = {
  controllerAs: 'vm',
  bindings: {
    items: '<'
  },
  template,
}

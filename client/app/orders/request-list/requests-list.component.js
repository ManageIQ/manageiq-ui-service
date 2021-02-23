import template from './requests-list.html';

export const RequestsListComponent = {
  bindings: {
    'items': '<',
    'config': '<?'
  },
  template,
  controllerAs: 'vm'
}

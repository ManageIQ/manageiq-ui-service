import templateUrl from './requests-list.html'

export const RequestsListComponent = {
  bindings: {
    'items': '<',
    'config': '<?'
  },
  templateUrl,
  controllerAs: 'vm'
}

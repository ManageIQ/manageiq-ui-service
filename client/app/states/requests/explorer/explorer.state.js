import templateUrl from './explorer.html';

/** @ngInject */
export function RequestsExplorerState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'requests.explorer': {
      url: '',
      templateUrl,
      controllerAs: 'vm',
      title: N_('Requests'),
      params: { 'filter': null },
    },
  };
}

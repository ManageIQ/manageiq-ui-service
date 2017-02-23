/** @ngInject */
export function RequestsExplorerState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'requests.explorer': {
      url: '',
      templateUrl: 'app/states/requests/explorer/explorer.html',
      controllerAs: 'vm',
      title: N_('Requests'),
    },
  };
}

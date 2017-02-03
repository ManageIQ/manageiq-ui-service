/** @ngInject */
export function RequestsExplorerState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'requests.explorer': {
      url: '',
      templateUrl: 'app/states/requests/explorer/explorer.html',
      controller: StateController,
      controllerAs: 'vm',
      title: N_('Requests'),
    },
  };
}

/** @ngInject */
function StateController(RequestsState) {
  var vm = this;
}

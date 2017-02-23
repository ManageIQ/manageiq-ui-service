/** @ngInject */
export function ServicesExplorerState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'services.explorer': {
      url: '',
      templateUrl: 'app/states/services/explorer/explorer.html',
      controllerAs: 'vm',
      title: N_('Services Explorer'),
    },
  };
}

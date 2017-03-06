import templateUrl from './explorer.html';

/** @ngInject */
export function ServicesExplorerState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'services.explorer': {
      url: '',
      templateUrl,
      controllerAs: 'vm',
      title: N_('Services Explorer'),
    },
  };
}

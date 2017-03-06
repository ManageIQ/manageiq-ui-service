import templateUrl from './catalogs.html';

/** @ngInject */
export function CatalogsExplorerState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'catalogs.explorer': {
      url: '',
      templateUrl,
      controller: CatalogsController,
      controllerAs: 'vm',
      title: N_('Catalogs'),
    },
  };
}

/** @ngInject */
function CatalogsController() {
  var vm = this;
  vm.title = __('Catalogs');
}

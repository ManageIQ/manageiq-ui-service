/** @ngInject */
export function CatalogsExplorerState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'catalogs.explorer': {
      url: '',
      templateUrl: 'app/states/catalogs/explorer/catalogs.html',
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

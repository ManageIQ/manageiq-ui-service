import templateUrl from './catalogs.html';

/** @ngInject */
export function CatalogsExplorerState(routerHelper, RBAC) {
  routerHelper.configureStates(getStates(RBAC));
}

function getStates(RBAC) {
  return {
    'catalogs.explorer': {
      url: '',
      templateUrl,
      controller: CatalogsController,
      controllerAs: 'vm',
      title: __('Catalogs'),
      data: {
        authorization: RBAC.hasAny(['catalogs', 'catalog_items_view']),
      },
    },
  };
}

/** @ngInject */
function CatalogsController() {
  var vm = this;
  vm.title = __('Catalogs');
}

import template from './catalogs.html';

/** @ngInject */
export function CatalogsExplorerState (routerHelper, RBAC) {
  routerHelper.configureStates(getStates(RBAC))
}

function getStates (RBAC) {
  return {
    'catalogs.explorer': {
      url: '',
      template,
      controller: CatalogsController,
      controllerAs: 'vm',
      title: __('Catalogs'),
      data: {
        authorization: RBAC.hasAny(['svc_catalog_provision', 'sui_svc_catalog_view'])
      }
    }
  }
}

/** @ngInject */
function CatalogsController () {
  const vm = this
  vm.title = __('Catalogs')
}

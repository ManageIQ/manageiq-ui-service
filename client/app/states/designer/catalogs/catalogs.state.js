/** @ngInject */
export function CatalogsState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'designer.catalogs': {
      parent: 'application',
      url: '/designer/catalogs',
      templateUrl: 'app/states/designer/catalogs/catalogs.html',
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

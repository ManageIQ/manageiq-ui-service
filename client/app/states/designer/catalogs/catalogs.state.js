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
      resolve: {
        designerCatalogs: resolveCatalogs,
        serviceTemplates: resolveServiceTemplates,
        tenants: resolveTenants,
      },
    },
  };
}

/** @ngInject */
function resolveServiceTemplates(CatalogsState) {
  return CatalogsState.getServiceTemplates();
}

/** @ngInject */
function resolveCatalogs(CatalogsState) {
  return CatalogsState.getCatalogs();
}

/** @ngInject */
function resolveTenants(CatalogsState) {
  return CatalogsState.getTenants();
}

/** @ngInject */
function CatalogsController(designerCatalogs, serviceTemplates, tenants, CatalogsState, $scope, $rootScope, $timeout) {
  var vm = this;
  vm.title = __('Catalogs');
  vm.designerCatalogs = designerCatalogs.resources;
  vm.serviceTemplates = serviceTemplates.resources;
  vm.tenants = tenants.resources;

  vm.refresh = refresh;

  function loadCatalogsSuccess(designerCatalogs) {
    $timeout(function() {  // Done in a timeout since results are massaged outside of a $digest
      vm.designerCatalogs = designerCatalogs.resources;
    });
  }

  function loadTemplatesSuccess(serviceTemplates) {
    $timeout(function() {  // Done in a timeout since results are massaged outside of a $digest
      vm.serviceTemplates = serviceTemplates.resources;
    });
  }

  function loadTenantsSuccess(tenants) {
    $timeout(function() {  // Done in a timeout since results are massaged outside of a $digest
      vm.tenants = tenants.resources;
    });
  }

  function loadFailure() {
  }

  function refreshCatalogs() {
    CatalogsState.getCatalogs().then(loadCatalogsSuccess, loadFailure);
  }

  function refreshServiceTemplates() {
    CatalogsState.getServiceTemplates().then(loadTemplatesSuccess, loadFailure);
  }

  function refreshTenants() {
    CatalogsState.getTenants().then(loadTenantsSuccess, loadFailure);
  }

  function refresh() {
    refreshCatalogs();
    refreshServiceTemplates();
    refreshTenants();
  }
  var onDestroy = $rootScope.$on('$stateChangeSuccess', function(event, toState) {
    if (toState.name === 'designer.catalogs') {
      vm.refresh();
    }
  });

  $scope.$on('$destroy', onDestroy);
}

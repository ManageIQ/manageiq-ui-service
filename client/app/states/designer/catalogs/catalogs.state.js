(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
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

    vm.refreshCatalogs = refreshCatalogs;

    function loadSuccess(designerCatalogs) {
      $timeout(function() {  // Done in a timeout since results are massaged outside of a $digest
        vm.designerCatalogs = designerCatalogs.resources;
      });
    }

    function loadFailure() {
    }

    function refreshCatalogs() {
      CatalogsState.getCatalogs().then(loadSuccess, loadFailure);
    }

    var onDestroy = $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      if (toState.name === 'designer.catalogs') {
        vm.refreshCatalogs();
      }
    });

    $scope.$on('$destroy', onDestroy);
  }
})();

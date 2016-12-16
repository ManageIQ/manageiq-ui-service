/* eslint camelcase: "off" */
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
      'designer.catalogs.editor': {
        url: '/edit/:catalogId',
        templateUrl: 'app/states/designer/catalogs/editor/editor.html',
        controller: StateController,
        controllerAs: 'vm',
        resolve: {
          catalogId: resolveCatalogId,
          catalogs: resolveCatalogs,
          serviceTemplates: resolveServiceTemplates,
        },
      },
    };
  }

  /** @ngInject */
  function resolveCatalogId($stateParams) {
    return parseInt($stateParams.catalogId, 10);
  }

  /** @ngInject */
  function resolveCatalogs(CatalogsState) {
    return CatalogsState.getCatalogs();
  }

  /** @ngInject */
  function resolveServiceTemplates(CatalogsState) {
    return CatalogsState.getServiceTemplates();
  }

  /** @ngInject */
  function StateController(catalogId, catalogs, serviceTemplates, lodash) {
    var vm = this;

    if (catalogId) {
      vm.catalog = lodash.find(catalogs.resources, {id: catalogId});
      vm.title = vm.catalog.name;
    } else {
      vm.title = __("Add Catalog");
    }

    vm.stateName = 'designer.catalogs.editor';
    vm.catalogs = catalogs;
    vm.serviceTemplates = serviceTemplates.resources;
  }
})();

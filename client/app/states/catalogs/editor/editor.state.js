/* eslint camelcase: "off" */
import templateUrl from './editor.html';


/** @ngInject */
export function CatalogsEditorState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'catalogs.editor': {
      url: '/edit/:catalogId',
      templateUrl,
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

  vm.stateName = 'catalogs.editor';
  vm.catalogs = catalogs;
  vm.serviceTemplates = serviceTemplates.resources;
}

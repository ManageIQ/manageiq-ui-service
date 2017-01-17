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
      'designer.blueprints.list': {
        url: '', // No url, this state is the index of projects
        templateUrl: 'app/states/designer/blueprints/list/list.html',
        controller: BlueprintsController,
        controllerAs: 'vm',
        title: N_('Blueprint List'),
        resolve: {
          blueprints: resolveBlueprints,
          serviceCatalogs: resolveServiceCatalogs,
          tenants: resolveTenants,
        },
      },
    };
  }

  /** @ngInject */
  function resolveBlueprints(CollectionsApi) {
    var options = {
      expand: 'resources',
      attributes: 'bundle',
    };

    return CollectionsApi.query('blueprints', options);
  }

  /** @ngInject */
  function resolveServiceCatalogs(CollectionsApi) {
    var options = {
      expand: 'resources',
      sort_by: 'name',
      sort_options: 'ignore_case',
    };

    return CollectionsApi.query('service_catalogs', options);
  }

  /** @ngInject */
  function resolveTenants(CollectionsApi) {
    var options = {
      expand: 'resources',
      attributes: ['id', 'name'],
      sort_by: 'name',
      sort_options: 'ignore_case',
    };

    return CollectionsApi.query('tenants', options);
  }

  /** @ngInject */
  function BlueprintsController(blueprints, serviceCatalogs, tenants) {
    var vm = this;
    vm.blueprints = blueprints.resources;
    vm.serviceCatalogs = serviceCatalogs.resources;
    vm.tenants = tenants.resources;
  }
})();

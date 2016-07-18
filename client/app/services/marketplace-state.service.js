(function() {
  'use strict';

  angular.module('app.services')
    .factory('MarketplaceState', MarketplaceStateFactory);

  /** @ngInject */
  function MarketplaceStateFactory() {
    var service = {};

    service.sort = {
      isAscending: true,
      currentField: { id: 'name', title: __('Name'), sortType: 'alpha' }
    };

    service.filters = [];

    service.setSort = function(currentField, isAscending) {
      service.sort.isAscending = isAscending;
      service.sort.currentField = currentField;
    };

    service.getSort = function() {
      return service.sort;
    };

    service.setFilters = function(filterArray) {
      service.filters = filterArray;
    };

    service.getFilters = function() {
      return service.filters;
    };

    service.publishedBlueprints = [];

    service.getPublishedBlueprints = function() {
      return service.publishedBlueprints;
    };

    service.publishBlueprint = function(blueprint) {
      blueprint.service_template_catalog = {"name": blueprint.catalog.name};
      service.publishedBlueprints.push(blueprint);
    };

    return service;
  }
})();

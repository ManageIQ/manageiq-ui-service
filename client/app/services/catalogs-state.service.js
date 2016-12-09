(function() {
  'use strict';

  angular.module('app.services')
      .factory('CatalogsState', CatalogsStateFactory);

  /** @ngInject */
  function CatalogsStateFactory(CollectionsApi) {
    var catalogState = {};

    catalogState.sort = {
      isAscending: true,
      currentField: {id: 'name', title: __('Name'), sortType: 'alpha'},
    };

    catalogState.filters = [];

    catalogState.setSort = function(currentField, isAscending) {
      catalogState.sort.isAscending = isAscending;
      catalogState.sort.currentField = currentField;
    };

    catalogState.getSort = function() {
      return catalogState.sort;
    };

    catalogState.setFilters = function(filterArray) {
      catalogState.filters = filterArray;
    };

    catalogState.getFilters = function() {
      return catalogState.filters;
    };

    catalogState.getCatalogs = function() {
      var options = {
        expand: 'resources',
      };

      return CollectionsApi.query('service_catalogs', options);
    };

    catalogState.getServiceTemplates = function() {
      var attributes = ['picture', 'picture.image_href', 'service_template_catalog.name'];
      var options = {
        expand: 'resources',
        filter: ['service_template_catalog_id>0', 'display=true'],
        attributes: attributes,
      };

      return CollectionsApi.query('service_templates', options);
    };

    catalogState.getTenants = function() {
      var options = {
        expand: 'resources',
      };

      return CollectionsApi.query('tenants', options);
    };

    catalogState.getServiceTemplateDialogs = function(serviceTemplateId) {
      var options = {
        expand: 'resources',
        attributes: ['id', 'label'],
      };

      return CollectionsApi.query('service_templates/' + serviceTemplateId + '/service_dialogs', options);
    };

    return catalogState;
  }
})();

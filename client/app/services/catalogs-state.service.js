(function() {
  'use strict';

  angular.module('app.services')
      .factory('CatalogsState', CatalogsStateFactory);

  /** @ngInject */
  function CatalogsStateFactory(CollectionsApi, EventNotifications, lodash, sprintf) {
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
        filter: ['display=true'],
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

    catalogState.setCatalogServiceTemplates = function(catalog, serviceTemplates) {
      if (!catalog.serviceTemplates) {
        catalog.serviceTemplates = [];
      } else {
        catalog.serviceTemplates.splice(0, catalog.serviceTemplates.length);
      }

      angular.forEach(catalog.service_templates.resources, function(nextTemplate) {
        var splits = nextTemplate.href.split('/');
        var templateId = parseInt(splits[splits.length - 1], 10);
        var serviceTemplate = lodash.find(serviceTemplates, {id: templateId});
        if (serviceTemplate) {
          catalog.serviceTemplates.push(serviceTemplate);
        }
      });
      catalog.serviceTemplates.sort(function(item1, item2) {
        return item1.name.localeCompare(item2.name);
      });
    };

    catalogState.addCatalog = function(catalogObj, skipResults) {
      var addObj = {
        "action": "create",
        "resource": catalogObj,
      };

      function createSuccess(response) {
        EventNotifications.success(sprintf(__("Designer catalog %s was created."), catalogObj.name));

        if (skipResults !== true) {
          return response.results[0];
        }
      }

      function createFailure(response) {
        EventNotifications.error(sprintf(__("There was an error creating designer catalog %s."), catalogObj.name));

        if (skipResults !== true) {
          return response.data;
        }
      }

      return CollectionsApi.post('service_catalogs', null, {}, catalogObj).then(createSuccess, createFailure);
    };

    catalogState.editCatalog = function(catalog, skipResults) {
      var editSuccess = function(response) {
        EventNotifications.success(sprintf(__('Designer catalog %s was successfully updated.'), catalog.name));

        if (skipResults !== true) {
          return response;
        }
      };

      var editFailure = function(response) {
        EventNotifications.error(sprintf(__('There was an error updating designer catalog %s.'), catalog.name));

        if (skipResults !== true) {
          return response.data;
        }
      };

      var editObj = {
        "action": "edit",
        "resource": catalog,
      };

      return CollectionsApi.post('service_catalogs', catalog.id, {}, editObj).then(editSuccess, editFailure);
    };

    catalogState.addServiceTemplates = function(catalogId, serviceTemplates, skipResults) {
      var editSuccess = function(response) {
        if (response && response.results && response.results[0] && response.results[0].success === false) {
          EventNotifications.error(__('There was an error updating catalog items for the designer catalog.'));

          if (skipResults !== true) {
            return {
              error: response.results[0].message,
            };
          }
        } else {
          EventNotifications.success(__('Designer catalog was successfully updated.'));

          if (skipResults !== true) {
            return response.results;
          }
        }
      };

      var editFailure = function(response) {
        EventNotifications.error(__('There was an error updating catalog items for the designer catalog.'));

        return response.data;
      };

      var editObj = {
        action: "assign",
        resources: serviceTemplates,
      };

      return CollectionsApi.post('service_catalogs/' + catalogId + '/service_templates', null, {}, editObj).then(editSuccess, editFailure);
    };

    catalogState.removeServiceTemplates = function(catalogId, serviceTemplates, skipResults) {
      var editSuccess = function(response) {
        EventNotifications.success(__('Designer catalog %s was successfully updated.'));

        if (skipResults !== true) {
          return response.data;
        }
      };

      var editFailure = function(response) {
        EventNotifications.error(__('There was an error updating catalog items for the designer catalog.'));

        if (skipResults !== true) {
          return response.results;
        }
      };

      var editObj = {
        action: "unassign",
        resources: serviceTemplates,
      };

      return CollectionsApi.post('service_catalogs/' + catalogId + '/service_templates', null, {}, editObj).then(editSuccess, editFailure);
    };

    return catalogState;
  }
})();

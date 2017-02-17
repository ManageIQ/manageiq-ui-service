/* eslint camelcase: "off" */

/** @ngInject */
export function CatalogsStateFactory(CollectionsApi, EventNotifications, sprintf, lodash) {
  const collection = 'service_catalogs';
  const sort = {
    isAscending: true,
    currentField: {id: 'name', title: __('Name'), sortType: 'alpha'},
  };
  let filters = [];

  return {
    getMinimal: getMinimal,
    getCatalogs: getCatalogs,
    getSort: getSort,
    setSort: setSort,
    getFilters: getFilters,
    setFilters: setFilters,
    addCatalog: addCatalog,
    editCatalog: editCatalog,
    setCatalogServiceTemplates: setCatalogServiceTemplates,
    getServiceTemplates: getServiceTemplates,
    addServiceTemplates: addServiceTemplates,
    removeServiceTemplates: removeServiceTemplates,
    deleteCatalogs: deleteCatalogs,
  };


  function setSort(currentField, isAscending) {
    sort.isAscending = isAscending;
    sort.currentField = currentField;
  }

  function getSort() {
    return sort;
  }

  function setFilters(filterArray) {
    filters = filterArray;
  }

  function getFilters() {
    return filters;
  }

  function getQueryFilters(filters) {
    const queryFilters = [];

    angular.forEach(filters, function(nextFilter) {
      if (nextFilter.id === 'name') {
        queryFilters.push("name='%" + nextFilter.value + "%'");
      } else {
        queryFilters.push(nextFilter.id + '=' + nextFilter.value);
      }
    });

    return queryFilters;
  }

  function getCatalogs(limit, offset) {
    const options = {
      expand: ['resources', 'service_templates'],
      attributes: ['tenant', 'picture', 'picture.image_href', 'service_template_catalog.name', 'dialogs'],
      limit: limit,
      offset: offset,
      filter: getQueryFilters(getFilters()),
    };

    options.sort_by = getSort().currentField.id;
    options.sort_options = getSort().currentField.sortType === 'alpha' ? 'ignore_case' : '';
    options.sort_order = getSort().isAscending ? 'asc' : 'desc';

    return CollectionsApi.query(collection, options);
  }

  function getMinimal() {
    const options = {
      filter: getQueryFilters(getFilters()),
      hide: 'resources',
    };

    return CollectionsApi.query(collection, options);
  }

  function addCatalog(catalogObj, skipResults) {
    var addObj = {
      "action": "create",
      "resource": catalogObj,
    };

    function createSuccess(response) {
      EventNotifications.success(sprintf(__("Catalog %s was created."), catalogObj.name));

      if (skipResults !== true) {
        return response.results[0];
      }
    }

    function createFailure(response) {
      EventNotifications.error(sprintf(__("There was an error creating catalog %s. "), catalogObj.name) + __(response.data.error.message));

      if (skipResults !== true) {
        return response.data;
      }
    }

    return CollectionsApi.post('service_catalogs', null, {}, catalogObj).then(createSuccess, createFailure);
  }

  function editCatalog(catalog, skipResults) {
    var editSuccess = function(response) {
      EventNotifications.success(sprintf(__('Catalog %s was successfully updated.'), catalog.name));

      if (skipResults !== true) {
        return response;
      }
    };

    var editFailure = function(response) {
      EventNotifications.error(sprintf(__('There was an error updating catalog %s.'), catalog.name));

      if (skipResults !== true) {
        return response.data;
      }
    };

    var editObj = {
      "action": "edit",
      "resource": catalog,
    };

    return CollectionsApi.post('service_catalogs', catalog.id, {}, editObj).then(editSuccess, editFailure);
  }

  function getServiceTemplates() {
    var attributes = ['picture', 'picture.image_href', 'service_template_catalog.name'];
    var options = {
      expand: 'resources',
      filter: ['display=true'],
      attributes: attributes,
    };

    return CollectionsApi.query('service_templates', options);
  }

  function addServiceTemplates(catalogId, serviceTemplates, skipResults) {
    var editSuccess = function(response) {
      if (response && response.results && response.results[0] && response.results[0].success === false) {
        EventNotifications.error(__('There was an error updating catalog items for the catalog.'));

        if (skipResults !== true) {
          return {
            error: response.results[0].message,
          };
        }
      } else {
        EventNotifications.success(__('Catalog was successfully updated.'));

        if (skipResults !== true) {
          return response.results;
        }
      }
    };

    var editFailure = function(response) {
      EventNotifications.error(__('There was an error updating catalog items for the catalog.'));

      return response.data;
    };

    var editObj = {
      action: "assign",
      resources: serviceTemplates,
    };

    return CollectionsApi.post('service_catalogs/' + catalogId + '/service_templates', null, {}, editObj).then(editSuccess, editFailure);
  }

  function removeServiceTemplates(catalogId, serviceTemplates, skipResults) {
    var editSuccess = function(response) {
      EventNotifications.success(__('Catalog was successfully updated.'));

      if (skipResults !== true) {
        return response.data;
      }
    };

    var editFailure = function(response) {
      EventNotifications.error(__('There was an error updating catalog items for the catalog.'));

      if (skipResults !== true) {
        return response.results;
      }
    };

    var editObj = {
      action: "unassign",
      resources: serviceTemplates,
    };

    return CollectionsApi.post('service_catalogs/' + catalogId + '/service_templates', null, {}, editObj).then(editSuccess, editFailure);
  }

  function setCatalogServiceTemplates(catalog, serviceTemplates) {
    if (angular.isUndefined(catalog.serviceTemplates)) {
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
  }


  function deleteCatalogs(catalogs) {
    var catalogIds = [];
    for (var i = 0; i < catalogs.length; i++) {
      catalogIds.push({id: catalogs[i].id});
    }

    var options = {
      action: "delete",
      resources: catalogIds,
    };

    function success() {
      EventNotifications.success(__('Catalog(s) were successfully deleted.'));
    }

    function failure() {
      EventNotifications.error(__('There was an error deleting the catalog(s).'));
    }

    return CollectionsApi.post('service_catalogs', null, {}, options).then(success, failure);
  }
}

/** @ngInject */
export function CatalogsStateFactory(CollectionsApi, EventNotifications, sprintf) {
  const collection = 'service_catalogs';
  let sort = {
    isAscending: true,
    currentField: {id: 'name', title: __('Name'), sortType: 'alpha'},
  };
  let filters = [];

  return {
    getSort: getSort,
    getMinimal: getMinimal,
    getCatalogs: getCatalogs,
    setSort: setSort,
    getFilters: getFilters,
    setFilters: setFilters,
    addCatalog: addCatalog,
    editCatalog: editCatalog,
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

  function getCatalogs() {
    const options = {
      expand: ['resources', 'service_templates'],
      attributes: ['tenant', 'picture', 'picture.image_href', 'service_template_catalog.name', 'dialogs'],
    };

    return CollectionsApi.query(collection, options);
  }

  function getMinimal(filters) {
    const options = {
      filter: getQueryFilters(filters),
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

  function editCatalog(catalog, skipResults) {
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
  }

  function addServiceTemplates(catalogId, serviceTemplates, skipResults) {
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
  }

  function removeServiceTemplates(catalogId, serviceTemplates, skipResults) {
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
      EventNotifications.success(__('Catalog(s) were succesfully deleted.'));
    }

    function failure() {
      EventNotifications.error(__('There was an error deleting the catalog(s).'));
    }

    return CollectionsApi.post('service_catalogs', null, {}, options).then(success, failure);
  }
}

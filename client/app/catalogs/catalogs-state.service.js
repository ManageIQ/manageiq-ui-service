/* eslint camelcase: "off" */

/** @ngInject */
export function CatalogsStateFactory(CollectionsApi, RBAC) {
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
    getPermissions: getPermissions,
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

  function getPermissions() {
    const permissions = {
      create: RBAC.hasAny(['st_catalog_new', 'st_catalog_admin']),
      edit: RBAC.hasAny(['st_catalog_edit', 'st_catalog_admin']),
      delete: RBAC.hasAny(['st_catalog_delete', 'st_catalog_admin']),
    };

    return permissions;
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
}

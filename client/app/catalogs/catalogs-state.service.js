/* eslint camelcase: "off" */

/** @ngInject */
export function CatalogsStateFactory(CollectionsApi, RBAC) {
  const sort = {
    isAscending: true,
    currentField: {id: 'name', title: __('Name'), sortType: 'alpha'},
  };
  let filters = [];

  return {
    getMinimal: getMinimal,
    getCatalogs: getCatalogs,
    getServiceTemplates: getServiceTemplates,
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
    const queryFilters = ["display=true"];

    angular.forEach(filters, function(nextFilter) {
      switch (nextFilter.id) {
        case 'name':
          queryFilters.push("name='%" + nextFilter.value + "%'");
          break;
        case 'description':
          queryFilters.push("description='%" + nextFilter.value + "%'");
          break;
        default:
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

  function getCatalogs() {
    const options = {
      expand: ['resources'],
    };

    return CollectionsApi.query('service_catalogs', options);
  }

  function getServiceTemplates(limit, offset) {
    const options = {
      expand: ['resources'],
      attributes: ['picture', 'picture.image_href', 'service_template_catalog'],
      limit: limit,
      offset: offset,
      filter: getQueryFilters(getFilters()),
    };

    options.sort_by = getSort().currentField.id;
    options.sort_options = getSort().currentField.sortType === 'alpha' ? 'ignore_case' : '';
    options.sort_order = getSort().isAscending ? 'asc' : 'desc';

    return CollectionsApi.query('service_templates', options);
  }

  function getMinimal(collection) {
    const options = {
      filter: getQueryFilters(getFilters()),
      hide: 'resources',
    };

    return CollectionsApi.query(collection, options);
  }
}

/* eslint camelcase: "off" */

/** @ngInject */
export function OrchestrationTemplatesFactory(ListConfiguration, CollectionsApi) {
  const collection = 'orchestration_templates';
  const service = {
    getMinimal: getMinimal,
    getTemplates: getTemplates,
  };

 // ListConfiguration.setupListFunctions(service, {id: 'placed_at', title: __('Order Date'), sortType: 'numeric'});

  return service;

  function getMinimal(filters) {
    const options = {
      filter: getQueryFilters(filters),
      hide: 'resources',
    };

    return CollectionsApi.query(collection, options);
  }

  function getTemplates(limit, offset, filters, sortField, sortAscending) {
    const options = {
      expand: ['resources', 'service_requests'],
      limit: limit,
      offset: String(offset),
      attributes: [],
      filter: getQueryFilters(filters),
    };

    if (angular.isDefined(sortField)) {
      options.sort_by = service.getSort().currentField.id;
      options.sort_options = service.getSort().currentField.sortType === 'alpha' ? 'ignore_case' : '';
      options.sort_order = sortAscending ? 'asc' : 'desc';
    }

    return CollectionsApi.query(collection, options);
  }

  // Private

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
}

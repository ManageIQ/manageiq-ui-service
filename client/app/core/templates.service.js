/* eslint camelcase: "off" */

/** @ngInject */
export function TemplatesFactory(CollectionsApi) {
  const collection = 'orchestration_templates';
  const service = {
    getMinimal: getMinimal,
    getTemplates: getTemplates,
  };

  return service;

  function getMinimal(filters) {
    const options = {
      filter: getQueryFilters(filters),
      hide: 'resources',
    };

    return CollectionsApi.query(collection, options);
  }

  function getTemplates(limit, offset, filters, sorting) {
    const options = {
      expand: ['resources'],
      limit: limit,
      offset: String(offset),
      attributes: [],
      filter: getQueryFilters(filters),
    };

    if (angular.isDefined(sorting)) {
      options.sort_by = sorting.field;
      options.sort_options = sorting.sortOptions;
      options.sort_order = sorting.direction;
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

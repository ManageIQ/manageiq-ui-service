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

    angular.forEach(filters, function (nextFilter) {
      if (nextFilter.id === 'name') {
        queryFilters.push("name='%" + nextFilter.value + "%'");
      } else if (nextFilter.id === 'type') {
        var filterText = nextFilter.value;
        var types = [
          { "expression": "aws*|amazon*|cloud\s?(formation)?", "type": "OrchestrationTemplateCfn" },
          { "expression": "open\s?(stack)?", "type": "OrchestrationTemplateHot" },
          { "expression": "vmware|vapps|vcenter", "type": "OrchestrationTemplateVapp" },
          { "expression": "azure|microsoft", "type": "OrchestrationTemplateAzure" },
        ];
        for (var i = 0; i < types.length; i++) {
          var templateType = types[i];
          var regex = new RegExp(templateType.expression, "i");
          if (filterText.match(regex)) {
            if (templateType.type === 'OrchestrationTemplateHot') {
              queryFilters.push(nextFilter.id + '=' + templateType.type);
              queryFilters.push('or ' + nextFilter.id + '=OrchestrationTemplateVnfd');
            } else {
              queryFilters.push(nextFilter.id + '=' + templateType.type);
            }
            break;
          }
        }
      } else {
        queryFilters.push(nextFilter.id + '=' + nextFilter.value);
      }
    });

    return queryFilters;
  }
}

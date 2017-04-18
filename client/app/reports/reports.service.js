/* eslint camelcase: "off" */

/** @ngInject */
export function ReportsServiceFactory(ListConfiguration, CollectionsApi, RBAC) {
  const collection = 'reports';
  const service = {
    listActions: {},
    getMinimal: getMinimal,
    getReports: getReports,
    getReportRuns: getReportRuns,
    queueReport: queueReport,
    getPermissions: getPermissions,
  };

  ListConfiguration.setupListFunctions(service.listActions, {id: 'updated_on', title: __('Updated'), sortType: 'numeric'});

  return service;

  function getMinimal(filters) {
    const options = {
      filter: getQueryFilters(filters),
      hide: 'resources',
    };

    return CollectionsApi.query(collection, options);
  }

  function getPermissions() {
    const permissions = {
      'view': RBAC.hasAny(['miq_report', 'miq_report_view']),
      'queue': RBAC.hasAny(['miq_report', 'miq_report_run']),
    };

    return permissions;
  }

  function getReports(limit, offset, filters) {
    const options = {
      expand: ['resources'],
      limit: limit,
      offset: String(offset),
      filter: getQueryFilters(filters),
      sort_by: service.listActions.getSort().currentField.id,
      sort_options: service.listActions.getSort().currentField.sortType === 'alpha' ? 'ignore_case' : '',
      sort_order: service.listActions.getSort().isAscending ? 'asc' : 'desc',
    };

    return CollectionsApi.query(collection, options);
  }

  function getReportRuns(reportId, limit, offset, filters, showResources, sorting) {
    const options = {
      limit: limit,
      offset: String(offset),
      filter: getQueryFilters(filters),
    };
    if (showResources) {
      options.expand = ['resources'];
    } else {
      options.hide = 'resources';
    }
    if (angular.isDefined(sorting)) {
      options.sort_by = sorting.field;
      options.sort_options = sorting.sortOptions;
      options.sort_order = sorting.direction;
    }
    const path = `${collection}/${reportId}/results`;

    return CollectionsApi.query(path, options);
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

  function queueReport(reportId, options) {
    return CollectionsApi.post(collection, reportId, {}, options);
  }
}

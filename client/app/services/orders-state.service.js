/* eslint camelcase: "off" */
(function() {
  'use strict';

  angular.module('app.services')
    .factory('OrdersState', Factory);

  /** @ngInject */
  function Factory(ListConfiguration, CollectionsApi) {
    const collection = 'service_orders';
    const service = {
      getMinimal: getMinimal,
      getOrders: getOrders,
    };

    ListConfiguration.setupListFunctions(service, {id: 'placed_at', title: __('Order Date'), sortType: 'numeric'});

    return service;

    function getMinimal(filters) {
      const options = {
        filter: getQueryFilters(filters),
        hide: 'resources',
      };

      return CollectionsApi.query(collection, options);
    }

    function getOrders(limit, offset, filters, sortField, sortAscending) {
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
})();

(function() {
  'use strict';

  angular.module('app.services')
    .factory('OrdersState', OrdersStateFactory);

  /** @ngInject */
  function OrdersStateFactory() {
    var service = {};

    service.sort = {
      isAscending: false,
      currentField: { id: 'placed_at', title: __('Ordered Date'), sortType: 'numeric' },
    };

    service.filters = [];

    service.setSort = function(currentField, isAscending) {
      service.sort.isAscending = isAscending;
      service.sort.currentField = currentField;
    };

    service.getSort = function() {
      return service.sort;
    };

    service.setFilters = function(filterArray) {
      service.filters = filterArray;
    };

    service.getFilters = function() {
      return service.filters;
    };

    return service;
  }
})();

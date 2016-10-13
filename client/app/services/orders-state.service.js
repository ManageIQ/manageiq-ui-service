(function() {
  'use strict';

  angular.module('app.services')
    .factory('OrdersState', OrdersStateFactory);

  /** @ngInject */
  function OrdersStateFactory(ListConfiguration) {
    var service = {};

    ListConfiguration.setupListFunctions(service, { id: 'placed_at', title: __('Order Date'), sortType: 'numeric' });

    return service;
  }
})();

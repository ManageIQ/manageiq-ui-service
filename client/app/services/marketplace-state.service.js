(function() {
  'use strict';

  angular.module('app.services')
    .factory('MarketplaceState', MarketplaceStateFactory);

  /** @ngInject */
  function MarketplaceStateFactory(ListConfiguration) {
    var service = {};

    ListConfiguration.setupListFunctions(service, { id: 'name', title: __('Name'), sortType: 'alpha' });

    return service;
  }
})();

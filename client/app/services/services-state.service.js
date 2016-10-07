
(function() {
  'use strict';

  angular.module('app.services')
    .factory('ServicesState', ServicesStateFactory);

  /** @ngInject */
  function ServicesStateFactory(ListConfiguration) {
    var service = {};

    ListConfiguration.setupListFunctions(service, { id: 'name', title: __('Name'), sortType: 'alpha' });

    return service;
  }
})();

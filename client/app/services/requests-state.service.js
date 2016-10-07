(function() {
  'use strict';

  angular.module('app.services')
    .factory('RequestsState', RequestsStateFactory);

  /** @ngInject */
  function RequestsStateFactory(ListConfiguration) {
    var service = {};

    ListConfiguration.setupListFunctions(service, { id: 'requested', title: __('Request Date'), sortType: 'numeric' });

    return service;
  }
})();

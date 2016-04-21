(function() {
  'use strict';

  angular.module('app.services')
  .factory('RBAC', RBACFactory);

  /** @ngInject */
  function RBACFactory() {
    var features = {};

    var service = {
      set: set,
      has: has,
    };

    return service;

    function set(productFeatures) {
      features = productFeatures || {};
    }

    function has(feature) {
      return feature in features;
    }
  }
})();

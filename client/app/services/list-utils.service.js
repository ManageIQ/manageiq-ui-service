(function() {
  'use strict';

  angular.module('app.services')
    .factory('ListUtils', ListUtilsFactory);

  /** @ngInject */
  function ListUtilsFactory(lodash) {
    var service = {
      findByField: findByField,
    };

    return service;

    function findByField(findArray, value, field) {
      if (angular.isArray(findArray) && angular.isString(field)) {
        return lodash.find(findArray, function(nextObject) {
          return nextObject[field] === value;
        });
      }
    }
  }
})();

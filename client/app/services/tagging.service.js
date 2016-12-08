(function() {
  'use strict';

  angular.module('app.services')
    .factory('taggingService', taggingService);

  /** @ngInject */
  function taggingService(CollectionsApi) {
    return {
      getTagCategories: getTagCategories,
    };

    function getTagCategories() {
      CollectionsApi.query();
    }
  }
})();

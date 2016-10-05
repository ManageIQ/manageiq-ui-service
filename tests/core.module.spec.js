(function() {
  'use strict';

  angular.module('app.core')
    .run(mock);

  function mock($httpBackend) {
    $httpBackend.when('GET', /available_languages.json/)
      .respond({});
    $httpBackend.when('GET', /\/api\/notifications/)
      .respond({});
  }
})();

(function () {
  'use strict'

  angular.module('app.states')
    .run(mock)

  function mock ($httpBackend) {
    $httpBackend.when('GET', /available_languages.json/)
      .respond({})
  }
})()

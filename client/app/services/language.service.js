(function() {
  'use strict';

  angular.module('app.services')
    .factory('Language', LanguageFactory);

  /** @ngInject */
  function LanguageFactory(gettextCatalog) {
    var service = {
      onLogin: onLogin,
      onReload: onReload,
    };

    return service;

    function onLogin(data) {
      var locale = data.settings && data.settings.locale;
      gettextCatalog.loadAndSet(locale);
    }

    function onReload(data) {
      var locale = data.settings && data.settings.locale;
      gettextCatalog.loadAndSet(locale);
    }
  }
})();

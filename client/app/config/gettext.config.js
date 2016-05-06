(function() {
  'use strict';

  angular.module('app')
    .run(init);

  /** @ngInject */
  function init(gettextCatalog, gettext) {
    // prepend [MISSING] to untranslated strings
    gettextCatalog.debug = false;

    gettextCatalog.loadAndSet = function(lang) {
      if (lang) {
        lang = lang.replace('_', '-');
        gettextCatalog.setCurrentLanguage(lang);
        gettextCatalog.loadRemote("gettext/json/" + lang + "/manageiq-ui-self_service.json");
      }
    };

    window.N_ = gettext;
    window.__ = gettextCatalog.getString.bind(gettextCatalog);
  }
})();

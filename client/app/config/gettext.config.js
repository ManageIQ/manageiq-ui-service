/* eslint no-unused-vars: 0 */
/* eslint no-constant-condition: "off" */

(function() {
  'use strict';

  angular.module('app')
    .run(init);

  /** @ngInject */
  function init($window, gettextCatalog, gettext) {
    // prepend [MISSING] to untranslated strings
    gettextCatalog.debug = false;

    gettextCatalog.loadAndSet = function(lang) {
      if (lang) {
        lang = lang.replace('_', '-');
        gettextCatalog.setCurrentLanguage(lang);
        if (lang !== 'en') {
          gettextCatalog.loadRemote("gettext/json/" + lang + "/manageiq-ui-service.json");
        }
      }
    };

    $window.N_ = gettext;
    $window.__ = gettextCatalog.getString.bind(gettextCatalog);
  }
})();

if (false) {
  // 'locale_name' will be translated into locale name in every translation
  // For example, in german translation it will be 'Deutsch', in slovak 'Slovensky', etc.
  // The localized locale name will then be presented to the user to select from in the UI.
  var localeName = __('locale_name');
}

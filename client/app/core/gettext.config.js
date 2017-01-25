/* eslint no-unused-vars: 0 */
/* eslint no-constant-condition: "off" */

/** @ngInject */
export function gettextInit($window, gettextCatalog, gettext) {
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

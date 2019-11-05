/* eslint no-constant-condition: "off" */
import languageFile from '../../gettext/json/manageiq-ui-service.json'
/** @ngInject */
export function gettextInit ($window, gettextCatalog, gettext) {
  // prepend [MISSING] to untranslated strings
  gettextCatalog.debug = false
  gettextCatalog.loadAndSet = function (lang) {
    if (lang) {
      lang = lang.replace('_', '-')
      gettextCatalog.setCurrentLanguage(lang)
      if (lang !== 'en') {
        gettextCatalog.setStrings(lang, languageFile[lang])
      }
    }
  }

  $window.N_ = gettext
  $window.__ = gettextCatalog.getString.bind(gettextCatalog)

  // 'locale_name' will be translated into locale name in every translation
  // For example, in german translation it will be 'Deutsch', in slovak 'Slovensky', etc.
  // The localized locale name will then be presented to the user to select from in the UI.
  const localeName = __('locale_name')
}

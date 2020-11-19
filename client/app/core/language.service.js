/* eslint camelcase: "off" */
import languageFile from '../../gettext/json/available_languages.json'
/** @ngInject */
export function LanguageFactory ($http, $q, $log, $sessionStorage, Session, $window, gettextCatalog, lodash) {
  var availableAvailable = $q.defer()
  var service = {
    available: {
      'en': 'English'  // not translated on purpose
    },
    ready: availableAvailable.promise,
    browser: browser,
    onLogin: onLogin,
    onReload: onReload,
    chosen: {
      code: null
    },
    save: save,
    match: match,
    userHref: null,
    setLocale: setLocale,
    setLoginLanguage: setLoginLanguage,
    fixState: fixState
  }

  init()

  return service

  function init () {
    lodash.extend(service.available, languageFile)
    availableAvailable.resolve(service.available)
  }

  // returns a list of user's preferred languages, in order
  function browser (navigator = $window.navigator) {
    var ary = []

    // the standard
    if (lodash.isArray(navigator.languages)) {
      ary = lodash.slice(navigator.languages)
    }

    // IE 11 and older browers
    if (navigator.language) {
      ary.push(navigator.language)
    }

    // IE<11
    if (navigator.userLanguage) {
      ary.push(navigator.userLanguage)
    }

    return lodash.uniq(ary)
  }

  function setLocale (code) {
    if (!code || (code === '_browser_')) {
      code = service.match(service.available, service.browser())
    } else {
      code = service.match(service.available, code)
    }
    service.chosen.code = code
    gettextCatalog.loadAndSet(code)

    return code
  }

  function getLocale (data) {
    return data &&
      data.settings &&
      data.settings.locale
  }

  function setUser (data) {
    service.userHref = data.identity.user_href.replace(/^.*?\/api\//, '/api/')
  }

  function onLogin (data) {
    setUser(data)
    var code = 'en'
    if ($sessionStorage.loginLanguage) {
      code = $sessionStorage.loginLanguage
      delete $sessionStorage.loginLanguage
      save(code)
      Session.updateUserSession({ settings: { locale: code } })
    } else {
      if (!service.chosen.code || (service.chosen.code === '_user_')) {
        code = getLocale(data)
      } else {
        code = service.chosen.code
        save(code)
      }
    }
    setLocale(code)

    return code
  }

  function onReload (data) {
    setUser(data)
    var code = getLocale(data)
    setLocale(code)

    return code
  }

  function save (code) {
    if (!service.userHref) {
      $log.error('Trying to save language selection without a valid userHref')
      return
    }

    if (code === '_browser_') {
      code = null
    }

    return $http.post(service.userHref, {
      action: 'edit',
      resource: {
        settings: {
          display: {
            locale: code
          }
        }
      }
    })
  }

  // returns the best match from available
  function match (available, requested) {
    var shorten = str => ({
      orig: str,
      short: str.replace(/[-_].*$/, '')
    })

    const short = {
      available: lodash.keys(available).map(shorten),
      requested: []
    }
    if (lodash.isArray(requested)) {
      short.requested = requested.map(shorten)
    } else {
      short.requested.push(shorten(requested))
    }
    for (var k in short.requested) {
      var r = short.requested[k]
      var match = lodash.find(short.available, function (a) {
        // try exact match first
        return a.orig.toLowerCase() === r.orig.toLowerCase()
      }) || lodash.find(short.available, function (a) {
        // lowercase, only language code match second
        return a.short.toLowerCase() === r.short.toLowerCase()
      })

      if (match) {
        return match.orig
      }
    }

    return 'en'
  }

  function setLoginLanguage (code) {
    const languageCode = service.match(service.available, code)
    $sessionStorage.loginLanguage = languageCode
    service.setLocale(code)
  }

  function fixState (state, toolbarConfig) {
    var fields = toolbarConfig.sortConfig.fields
    var current = state.sort.currentField

    if (!current || !current.id) {
      return
    }

    var found = lodash.find(fields, { id: current.id }) || current

    // can't just replace currentField, the original instance stays inside pf-sort
    state.sort.currentField.title = found.title
  }
}

(function() {
  'use strict';

  angular.module('app.services')
    .factory('Language', LanguageFactory);

  /** @ngInject */
  function LanguageFactory($http, $q, gettextCatalog, lodash) {
    var availableAvailable = $q.defer();
    var service = {
      available: {
        'en': 'English',  // not translated on purpose
      },
      ready: availableAvailable.promise,
      browser: browser,
      onLogin: onLogin,
      onReload: onReload,
      chosen: {
        code: null,
      },
      save: save,
      match: match,
      user_href: null,
      setLocale: setLocale,
      fixState: fixState,
    };

    init();

    return service;

    function init() {
      $http.get('gettext/json/available_languages.json')
      .then(function(response) {
        lodash.extend(service.available, response.data);
        availableAvailable.resolve(service.available);
      });
    }

    // returns a list of user's preferred languages, in order
    function browser() {
      var ary = [];

      // the standard
      if (lodash.isArray(window.navigator.languages)) {
        ary = lodash.slice(window.navigator.languages);
      }

      // IE 11 and older browers
      if (window.navigator.language) {
        ary.push(window.navigator.language);
      }

      // IE<11
      if (window.navigator.userLanguage) {
        ary.push(window.navigator.userLanguage);
      }

      return lodash.uniq(ary);
    }

    function setLocale(code) {
      if (!code || (code === '_browser_')) {
        code = service.match(service.available, service.browser());
      }

      gettextCatalog.loadAndSet(code);

      return code;
    }

    function getLocale(data) {
      return data
        && data.settings
        && data.settings.ui_self_service
        && data.settings.ui_self_service.display
        && data.settings.ui_self_service.display.locale;
    }

    function setUser(data) {
      service.user_href = data.identity.user_href.replace(/^.*?\/api\//, '/api/');
    }

    function onLogin(data) {
      setUser(data);

      var code = 'en';
      if (!service.chosen.code || (service.chosen.code === '_user_')) {
        code = getLocale(data);
      } else {
        code = service.chosen.code;
        save(code);
      }

      setLocale(code);
    }

    function onReload(data) {
      setUser(data);

      var code = getLocale(data);
      setLocale(code);
    }

    function save(code) {
      if (!service.user_href) {
        console.error('Trying to save language selection without a valid user_href');

        return;
      }

      if (code === '_browser_') {
        code = null;
      }

      return $http.post(service.user_href, {
        action: 'edit',
        resource: {
          settings: {
            ui_self_service: {
              display: {
                locale: code,
              },
            },
          },
        },
      });
    }

    // returns the best match from available
    function match(available, requested) {
      var shorten = function(str) {
        return {
          orig: str,
          short: str.replace(/[-_].*$/, ''),
        };
      };

      var short = {
        available: lodash.keys(available).map(shorten),
        requested: requested.map(shorten),
      };

      for (var k in short.requested) {
        /* jshint -W089, -W083 */
        var r = short.requested[k];

        var match = lodash.find(short.available, function(a) {
          // try exact match first
          return a.orig.toLowerCase() === r.orig.toLowerCase();
        }) || lodash.find(short.available, function(a) {
          // lowercase, only language code match second
          return a.short.toLowerCase() === r.short.toLowerCase();
        });

        if (match) {
          return match.orig;
        }
      }

      return 'en';
    }

    function fixState(state, toolbarConfig) {
      var fields = toolbarConfig.sortConfig.fields;
      var current = state.sort.currentField;

      if (!current || !current.id) {
        return;
      }

      var found = lodash.find(fields, { id: current.id }) || current;

      // can't just replace currentField, the original instance stays inside pf-sort
      state.sort.currentField.title = found.title;
    }
  }
})();

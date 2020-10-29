/* global Language, $http, $window */
describe('Language', () => {
  const user = {
    'settings': {
      'ui_service': {
        'display': {
          'locale': 'en',
        },
      },
      'display': {
        'local': 'en',
      },
      'locale': 'en',
      'asynchronous_notifications': true,
    },
    'identity': {
      'userid': 'admin',
      'name': 'Administrator',
      'user_href': 'http://localhost:3001/api/users/1',
      'group': 'EvmGroup-super_administrator',
      'group_href': 'http://localhost:3001/api/groups/2',
      'role': 'EvmRole-super_administrator',
      'role_href': 'http://localhost:3001/api/roles/1',
      'tenant': 'My Company',
      'groups': [
        'EvmGroup-super_administrator',
      ],
    },
  };

  beforeEach(() => {
    module('app.states');
    bard.inject('Language', '$http', '$window');
  });

  describe('#match', () => {
    it('matches short available with long accepted', () => {
      const available = {'ja': '', 'en': '', 'fr': ''};
      const accepted = ['fr-FR', 'en'];

      expect(Language.match(available, accepted)).to.eq('fr');
    });

    it('matches long available with short accepted', () => {
      const available = {'ja-JP': '', 'en': '', 'fr-FR': ''};
      const accepted = ['fr', 'en'];

      expect(Language.match(available, accepted)).to.eq('fr-FR');
    });

    it('should default to english if an invalid language is passed in', () => {
      const available = {'ja': '', 'en': '', 'fr': ''};
      const accepted = ['blerg'];
      const selectedLanguage = Language.match(available, accepted);

      expect(selectedLanguage).to.eq('en');
    });
  });

  describe('#browser', () => {
    it('browser accepts array of supported languages', () => {
      const languages = Language.browser({
        languages: ['en', 'es'],
      });

      expect(languages).to.eql(['en', 'es']);
    });

    it('browser IE 11 support getting language', () => {
      const languages = Language.browser({
        language: 'en',
      });

      expect(languages).to.eql(['en']);
    });

    it('browser < IE 11 support getting language', () => {
      const languages = Language.browser({
        userLanguage: 'en',
      });

      expect(languages).to.eql(['en']);
    });
  });

  describe('#setLocale', () => {
    it('should allow a empty locale to be set', () => {
      const locale = Language.setLocale();

      expect(locale).to.eq('en');
    });

    it('should allow a locale to be set', () => {
      const locale = Language.setLocale('es');

      expect(locale).to.eq('es');
    });
  });

  describe('#onLogin', () => {
    it('should set language on login', () => {
      const selectedLanguage = Language.onLogin(user);

      expect(selectedLanguage).to.eq('en');
    });

    it('should set language to saved language if one is set', () => {
      Language.chosen.code = 'es';
      const selectedLanguage = Language.onLogin(user);

      expect(selectedLanguage).to.eq('es');
    });
  });

  describe('#onReload', () => {
    it('should set language on reload', () => {
      const selectedLanguage = Language.onReload(user);

      expect(selectedLanguage).to.eq('en');
    });
  });

  describe('#save', () => {
    it('should return nothing and not save if userhref is not set', () => {
      const returnValue = Language.save('en');

      expect(returnValue).to.be.undefined;
    });

    it('should set language code to null on save if code is _browser_', () => {
      Language.userHref = 'http://localhost:3001/api/users/1';
      const postData = {
        'action': 'edit',
        'resource': {
          'settings': {'display': {'locale': null}},
        },
      };
      const saveApiSpy = sinon.spy($http, 'post');
      Language.save('_browser_');

      expect(saveApiSpy).to.have.been.calledWith('http://localhost:3001/api/users/1', postData);
    });
  });

  describe('#fixState', () => {
    it('should return empty if no sort field is set', () => {
      const state = {'sort': {}};
      const fields = {
        'sortConfig': {
          'fields': [],
        },
      };
      const fixedState = Language.fixState(state, fields);

      expect(fixedState).to.be.undefined;
    });
  });
});

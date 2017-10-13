describe('Session', () => {
  var reloadOk

  beforeEach(() => {
    module('app.core')

    reloadOk = false

    module(function ($provide) {
      $provide.value('$window', {
        get location () {
          return {
            get href () {
              return window.location.href
            },
            set href (str) {
              reloadOk = true
            },

            reload: () => {
              reloadOk = true
            },
          }
        },
        set location (str) {
          return
        },
        get document () {
          return window.document
        },
        angular: {
          callbacks: window.angular.callbacks
        },
      })
    })

    bard.inject('Session', 'RBAC', '$window', '$sessionStorage', '$httpBackend', 'gettextCatalog', '$state')
  })

  describe('switchGroup', () => {
    it('should persist and not reload the window', () => {
      $sessionStorage.miqGroup = 'bad'

      Session.setGroup('good')

      expect($sessionStorage.miqGroup).to.eq('good')
      expect(reloadOk).to.eq(false)
    })

    it('should update model.user group_href and group', () => {
      const newGroup = {
        description: 'Tenant My Company access',
        href: 'http://localhost:3001/api/groups/10000000000001',
        id: '10000000000001'
      }
      expect(Session.current.user.group).to.be.undefined
      Session.setGroup(newGroup)
      expect(Session.current.user.group).to.be.eq(newGroup.description)

    })

    it('updates user session storage', () => {
      $sessionStorage.user = JSON.stringify(readJSON('tests/mock/session/user.json'))
      Session.updateUserSession({settings: {ui_service: {display: {locale: 'fr'}}}})
      let user =  JSON.parse($sessionStorage.user)
      expect(user.settings.ui_service.display.locale).to.eq('fr')
    })
  })

  describe('setRBAC', function ($httpBackend, gettextCatalog, $state, RBAC) {
    beforeEach(inject(function (_$httpBackend_, _gettextCatalog_, _$state_, _RBAC_) {
      $httpBackend = _$httpBackend_
      gettextCatalog = _gettextCatalog_
      $state = _$state_
      RBAC = _RBAC_
    }))

    it('sets RBAC for actions and navigation', () => {
      var response = {
        authorization: {
          product_features: {
            dashboard_view: {},
            service_view: {},
            service_edit: {}
          }
        }, identity: {}
      }
      gettextCatalog.loadAndSet = () => {}
      $httpBackend.whenGET('/api?attributes=authorization').respond(response)
      Session.loadUser()
      $httpBackend.flush()
      var navFeatures = RBAC.getNavFeatures()

      expect(navFeatures.services.show).to.eq(true)
      expect(navFeatures.orders.show).to.eq(false)
      expect(navFeatures.catalogs.show).to.eq(false)
    })

    it('sets visibility for "Service Catalogs" and "Requests" only on navbar and enables "Service Request" button', () => {
      var response = {
        authorization: {
          product_features: {
            catalog_items_view: {},
            svc_catalog_provision: {},
          }
        }, identity: {}
      }
      gettextCatalog.loadAndSet = () => {}
      $httpBackend.whenGET('/api?attributes=authorization').respond(response)
      Session.loadUser()
      $httpBackend.flush()
      var navFeatures = RBAC.getNavFeatures()

      expect(navFeatures.services.show).to.eq(false)
      expect(navFeatures.orders.show).to.eq(true)
      expect(navFeatures.catalogs.show).to.eq(true)
    })
    it('allows a pause to be set globally', () => {
      const pauseLength = Session.setPause(20)
      expect(pauseLength).to.equal(20000)
    })
    it('returns false if user is not entitled to use ssui', () => {
      var response = {
        authorization: {
          product_features: {}
        }, identity: {}
      }
      gettextCatalog.loadAndSet = () => {}
      $httpBackend.whenGET('/api?attributes=authorization').respond(response)
      Session.loadUser()
      $httpBackend.flush()

      expect(RBAC.navigationEnabled()).to.eq(false)
    })
    it('allows a user to be retrieved from session', () => {
      const user = readJSON('tests/mock/session/user.json')
      const expectedUserProps = ['userid', 'name', 'user_href', 'group', 'group_href', 'role', 'role_href', 'tenant', 'groups']
      $sessionStorage.user = user
      Session.loadUser()
      const userInfo = Session.currentUser()
      expect(userInfo).to.have.all.keys(expectedUserProps)
    })
    it('allows miq user group to be set from session', () => {
      const user = readJSON('tests/mock/session/user.json')
      $sessionStorage.selectedMiqGroup = 'EvmGroup-super_administrator'
      $sessionStorage.user = user
      Session.loadUser()
      const userInfo = Session.currentUser()
      expect($sessionStorage.miqGroup).to.eq('EvmGroup-super_administrator')
    })
    it('allow a ws token to be set', () => {
      bard.inject('$http', '$cookies')
      const wsTokenResponse = {
        'data': {
          'auth_token': '9873777d3e7acddf76e279f65261deeb',
          'token_ttl': 3600,
          'expires_on': '2017-05-16T18:45:10Z'
        }
      }
      const wsTokensApiSpy = sinon.stub($http, 'get').returns(Promise.resolve(wsTokenResponse))
      const wsTokenSpy = sinon.spy($cookies, 'put')

      return Session.requestWsToken('').then((data) => {
        expect(wsTokenSpy).to.have.been.calledWith('ws_token', '9873777d3e7acddf76e279f65261deeb', {path: '/ws/notifications'})
      })
    })
  })
})

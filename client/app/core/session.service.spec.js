/* global $localStorage, Session, readJSON, inject, $http, $cookies */
/* eslint-disable no-unused-expressions */
describe('Session', () => {
  let reloadOk

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
            }
          }
        },
        set location (str) {

        },
        get document () {
          return window.document
        },
        angular: {
          callbacks: window.angular.callbacks
        }
      })
    })

    bard.inject('Session', 'RBAC', '$window', '$localStorage', '$httpBackend', 'gettextCatalog', '$state')
  })

  describe('switchGroup', () => {
    it('should persist and not reload the window', () => {
      $localStorage.miqGroup = 'bad'

      Session.setGroup('good')

      expect($localStorage.miqGroup).to.eq('good')
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
      $localStorage.user = JSON.stringify(readJSON('tests/mock/session/user.json'))
      Session.updateUserSession({settings: {ui_service: {display: {locale: 'fr'}}}})
      let user = JSON.parse($localStorage.user)
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
      const response = {
        authorization: {
          product_features: {}
        },
        identity: {}
      }
      response.authorization.product_features[RBAC.FEATURES.SERVICES.VIEW] = {}
      gettextCatalog.loadAndSet = () => {}
      $httpBackend.whenGET('/api?attributes=authorization').respond(response)
      Session.loadUser()
      $httpBackend.flush()

      expect(RBAC.has(RBAC.FEATURES.SERVICES.VIEW)).to.eq(true)
      expect(RBAC.has(RBAC.FEATURES.ORDERS.VIEW)).to.eq(false)
      expect(RBAC.has(RBAC.FEATURES.SERVICE_CATALOG.VIEW)).to.eq(false)
    })

    it('sets visibility for "Service Catalogs" and "Orders" only on navbar and enables "Order" button', () => {
      const response = {
        authorization: {
          product_features: {}
        },
        identity: {}
      }
      response.authorization.product_features[RBAC.FEATURES.ORDERS.VIEW] = {}
      response.authorization.product_features[RBAC.FEATURES.SERVICE_CATALOG.VIEW] = {}

      gettextCatalog.loadAndSet = () => {}
      $httpBackend.whenGET('/api?attributes=authorization').respond(response)
      Session.loadUser()
      $httpBackend.flush()

      expect(RBAC.has(RBAC.FEATURES.SERVICES.VIEW)).to.eq(false)
      expect(RBAC.has(RBAC.FEATURES.ORDERS.VIEW)).to.eq(true)
      expect(RBAC.has(RBAC.FEATURES.SERVICE_CATALOG.VIEW)).to.eq(true)
    })
    it('allows a pause to be set globally', () => {
      const pauseLength = Session.setPause(20)
      expect(pauseLength).to.equal(20000)
    })
    it('returns false if user is not entitled to use ssui', () => {
      var response = {
        authorization: {
          product_features: {}
        },
        identity: {}
      }
      gettextCatalog.loadAndSet = () => {}
      $httpBackend.whenGET('/api?attributes=authorization').respond(response)
      Session.loadUser()
      $httpBackend.flush()

      expect(RBAC.suiAuthorized()).to.eq(false)
    })
    it('allows a user to be retrieved from session', () => {
      const user = readJSON('tests/mock/session/user.json')
      const expectedUserProps = ['userid', 'name', 'user_href', 'group', 'group_href', 'role', 'role_href', 'tenant', 'groups']
      $localStorage.user = user
      Session.loadUser()
      const userInfo = Session.currentUser()
      expect(userInfo).to.have.all.keys(expectedUserProps)
    })
    it('allows miq user group to be set from session', () => {
      const user = readJSON('tests/mock/session/user.json')
      $localStorage.selectedMiqGroup = 'EvmGroup-super_administrator'
      $localStorage.user = user
      Session.loadUser()

      expect($localStorage.miqGroup).to.eq('EvmGroup-super_administrator')
    })
    it('allow a ws token to be set', (done) => {
      bard.inject('$http', '$cookies')
      const wsTokenResponse = {
        'data': {
          'auth_token': '9873777d3e7acddf76e279f65261deeb',
          'token_ttl': 3600,
          'expires_on': '2017-05-16T18:45:10Z'
        }
      }
      sinon.stub($http, 'get').returns(Promise.resolve(wsTokenResponse))
      const wsTokenSpy = sinon.spy($cookies, 'put')

      Session.requestWsToken('').then((data) => {
        done()

        expect(wsTokenSpy).to.have.been.calledWith('ws_token', '9873777d3e7acddf76e279f65261deeb', {path: '/ws/notifications'})
      })
    })
  })
})

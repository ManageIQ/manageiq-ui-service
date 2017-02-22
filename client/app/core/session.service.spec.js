describe('Session', function() {
  var reloadOk;

  beforeEach(function() {
    module('app.core');

    reloadOk = false;

    module(function($provide) {
      $provide.value('$window', {
        get location() {
          return {
            get href() {
              return window.location.href;
            },
            set href(str) {
              reloadOk = true;
            },

            reload: function() {
              reloadOk = true;
            },
          };
        },
        set location(str) {
          return;
        },
        get document() {
          return window.document;
        },
      });
    });

    bard.inject('Session','RBAC', '$window', '$sessionStorage', '$httpBackend', 'gettextCatalog', '$state');
  });

  describe('switchGroup', function() {
    it('should persist and reload', function() {
      $sessionStorage.miqGroup = 'bad';

      Session.switchGroup('good');

      expect($sessionStorage.miqGroup).to.eq('good');
      expect(reloadOk).to.eq(true);
    });
  });

  describe('setRBAC', function($httpBackend, gettextCatalog, $state, RBAC) {
    beforeEach(inject(function(_$httpBackend_, _gettextCatalog_, _$state_, _RBAC_) {
      $httpBackend = _$httpBackend_;
      gettextCatalog = _gettextCatalog_;
      $state = _$state_;
      RBAC = _RBAC_;
    }));

    it('sets RBAC for actions and navigation', function() {
      var response = {authorization: {product_features: {
        service_view: {},
        service_edit: {}
      }}, identity: {}};
      gettextCatalog.loadAndSet = function() {};
      $httpBackend.whenGET('/api?attributes=authorization').respond(response);
      Session.loadUser();
      $httpBackend.flush();
      var navFeatures = RBAC.getNavFeatures();
      var actionFeatures = RBAC.getActionFeatures();

      expect(navFeatures.dashboard.show).to.eq(true);
      expect(navFeatures.services.show).to.eq(true);
      expect(navFeatures.requests.show).to.eq(false);
      expect(navFeatures.catalogs.show).to.eq(false);

      expect(actionFeatures.serviceEdit.show).to.eq(true);
      expect(actionFeatures.serviceDelete.show).to.eq(false);
      expect(actionFeatures.serviceReconfigure.show).to.eq(false);
    });

    it('sets visibility for "Service Catalogs" and "Requests" only on navbar and enables "Service Request" button', function() {
      var response = {authorization: {product_features: {
        svc_catalog_provision: {},
        miq_request_view: {}
      }}, identity: {}};
      gettextCatalog.loadAndSet = function() {};
      $httpBackend.whenGET('/api?attributes=authorization').respond(response);
      Session.loadUser();
      $httpBackend.flush();
      var navFeatures = RBAC.getNavFeatures();

      expect(navFeatures.dashboard.show).to.eq(true);
      expect(navFeatures.services.show).to.eq(false);
      expect(navFeatures.requests.show).to.eq(true);
      expect(navFeatures.catalogs.show).to.eq(true);
    });

    it('returns false if user is not entitled to use ssui', function() {
      var response = {authorization: {product_features: {
      }}, identity: {}};
      gettextCatalog.loadAndSet = function() {};
      $httpBackend.whenGET('/api?attributes=authorization').respond(response);
      Session.loadUser();
      $httpBackend.flush();

      expect(RBAC.navigationEnabled()).to.eq(false);
    });
  });
});

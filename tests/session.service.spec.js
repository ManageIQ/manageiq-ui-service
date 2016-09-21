/* jshint -W117, -W030 */
describe('Session', function() {
  var reloadOk;

  beforeEach(function() {
    module('app.core', 'gettext');

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
      });
    });

    bard.inject('Session', '$window', '$sessionStorage', '$httpBackend', 'gettextCatalog', '$state');
  });

  describe('switchGroup', function() {
    it('should persist and reload', function() {
      $sessionStorage.miqGroup = 'bad';

      Session.switchGroup('good');

      expect($sessionStorage.miqGroup).to.eq('good');
      expect(reloadOk).to.eq(true);
    });
  });

  describe('setRBAC', function($httpBackend, gettextCatalog, $state) {
    beforeEach(inject(function(_$httpBackend_, _gettextCatalog_, _$state_) {
      $httpBackend = _$httpBackend_;
      gettextCatalog = _gettextCatalog_;
      $state = _$state_;
    }));

    it('sets RBAC for actions and navigation', function() {
      var response = {authorization: {product_features: {
        service_view: {},
        service_edit: {}
      }}};
      gettextCatalog.loadAndSet = function() {};
      $httpBackend.whenGET('/api?attributes=authorization').respond(response);
      Session.loadUser();
      $httpBackend.flush();

      expect($state.navFeatures.dashboard.show).to.eq(true);
      expect($state.navFeatures.services.show).to.eq(true);
      expect($state.navFeatures.requests.show).to.eq(false);
      expect($state.navFeatures.marketplace.show).to.eq(false);

      expect($state.actionFeatures.serviceEdit.show).to.eq(true);
      expect($state.actionFeatures.serviceDelete.show).to.eq(false);
      expect($state.actionFeatures.serviceReconfigure.show).to.eq(false);
    });

    it('sets visibility for "Service Catalogs" and "Requests" only on navbar and enables "Service Request" button', function() {
      var response = {authorization: {product_features: {
        svc_catalog_provision: {},
        miq_request_view: {}
      }}};
      gettextCatalog.loadAndSet = function() {};
      $httpBackend.whenGET('/api?attributes=authorization').respond(response);
      Session.loadUser();
      $httpBackend.flush();

      expect($state.navFeatures.dashboard.show).to.eq(true);
      expect($state.navFeatures.services.show).to.eq(false);
      expect($state.navFeatures.requests.show).to.eq(true);
      expect($state.navFeatures.marketplace.show).to.eq(true);
    });

    it('returns false if user is not entitled to use ssui', function() {
      var response = {authorization: {product_features: {
      }}};
      gettextCatalog.loadAndSet = function() {};
      $httpBackend.whenGET('/api?attributes=authorization').respond(response);
      Session.loadUser();
      $httpBackend.flush();

      expect(Session.activeNavigationFeatures()).to.eq(false);
    });
  });
});

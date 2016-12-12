describe('app.states.CatalogsState', function() {
  beforeEach(function () {
    module('app.services', 'app.config', 'app.states', 'gettext');
    bard.inject('$location', '$rootScope', '$state', '$templateCache', 'Session', '$httpBackend');
  });

  beforeEach(function () {
    Session.create({
      auth_token: 'b10ee568ac7b5d4efbc09a6b62cb99b8',
    });
    $httpBackend.whenGET('').respond(200);
  });

  describe('route', function() {

    beforeEach(function() {
      bard.inject('$state');
    });

    it('should work with $state.go', function() {
      $state.go('designer.catalogs');
      expect($state.is('designer.catalogs'));
    });

  });

  describe('controller', function() {

    var catalogs = {
      resources: [
        {
          id: '1',
          name: '1',
        },
        {
          id: '2',
          name: '2',
        },
        {
          id: '3',
          name: '3',
        }
      ]
    };

    var serviceTemplates = {
      resources: [
        {
          id: '1',
          name: '1',
        },
        {
          id: '2',
          name: '2',
        },
        {
          id: '3',
          name: '3',
        }
      ]
    };

    var tenants = {
      resources: [
        {
          id: '1',
          name: '1',
        },
        {
          id: '2',
          name: '2',
        },
        {
          id: '3',
          name: '3',
        }
      ]
    };

    beforeEach(function() {
      bard.inject('$controller', '$state', '$rootScope', '$document', 'CatalogsState');
    });

    it('should get catalogs from the API when viewing catalogs list', function () {
      var getProfilesSpy = sinon.stub(CatalogsState, 'getCatalogs').returns(Promise.resolve(catalogs));

      $state.go('designer.catalogs');

      expect(getProfilesSpy).to.have.been.called;
    });

    it('should get service templates from the API when viewing catalogs list', function () {
      var getProfilesSpy = sinon.stub(CatalogsState, 'getServiceTemplates').returns(Promise.resolve(serviceTemplates));

      $state.go('designer.catalogs');

      expect(getProfilesSpy).to.have.been.called;
    });

    it('should get tenants from the API when viewing catalogs list', function () {
      var getProfilesSpy = sinon.stub(CatalogsState, 'getTenants').returns(Promise.resolve(tenants));

      $state.go('designer.catalogs');

      expect(getProfilesSpy).to.have.been.called;
    });

  });
});


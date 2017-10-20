describe('Dashboard', function() {
  const permissions = readJSON('tests/mock/rbac/allPermissions.json');
  beforeEach(function() {
    module('app.core', 'app.states', 'app.orders', 'app.services');
    bard.inject('$location', '$rootScope', '$state', '$templateCache', '$httpBackend', '$q', 'RBAC');
    RBAC.set(permissions);
  });

  beforeEach(function() {
    var d = new Date();
    d.setMinutes(d.getMinutes() + 30);
    d = d.toISOString();
    d = d.substring(0, d.indexOf('.'));

    $httpBackend.whenGET('').respond(200);
  });

  describe('route', function() {
    var views = {
      dashboard: 'app/states/dashboard/dashboard.html'
    };

    beforeEach(function() {
      bard.inject('$location', '$rootScope', '$state', '$templateCache');
    });

    it('should work with $state.go', function() {
      $state.go('dashboard');
      expect($state.is('dashboard'));
    });
  });

  describe('controller', function() {
    var controller;
    var state;
    let dashboardState;
    var resolveServicesWithDefinedServiceIds = {};
    var retiredServices = {};
    var resolveNonRetiredServices = {};
    var expiringServices = {};
    var resolveAllRequests = [];

    beforeEach(function() {
      bard.inject('$controller', '$log', '$state', '$rootScope', 'CollectionsApi', 'RBAC');

      var controllerResolves = {
        definedServiceIdsServices: resolveServicesWithDefinedServiceIds,
        retiredServices: retiredServices,
        nonRetiredServices: resolveNonRetiredServices,
        expiringServices: expiringServices,
        allRequests: resolveAllRequests
      };

      dashboardState = $state.get('dashboard');

      state = $state;
      controller = $controller(dashboardState.controller, controllerResolves);
    });

    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

    describe('resolveExpiringServices', function() {

      it('makes a query request using the CollectionApi', function() {
        var clock = sinon.useFakeTimers(new Date('2016-01-01').getTime());
        let collectionsApiSpy = sinon.stub(CollectionsApi);
        
        dashboardState.resolve.expiringServices(collectionsApiSpy, RBAC);

        expect(collectionsApiSpy.query).to.have.been.calledWith('services', {
          hide: 'resources',
          filter: [
            'retired=false',
            'retires_on>2016-01-01T00:00:00.000Z',
            'retires_on<2016-01-31T00:00:00.000Z'
          ]
        });

        clock.restore();
      });
    });
  });
});

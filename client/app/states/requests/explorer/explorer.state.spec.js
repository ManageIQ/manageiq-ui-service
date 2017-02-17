describe('Dashboard', function() {
  beforeEach(function() {
    module('app.states', 'app.requests');
    bard.inject('$location', '$rootScope', '$state', '$templateCache', 'Session');
  });

  describe('route', function() {
    beforeEach(function() {
      bard.inject('$location', '$rootScope', '$state', '$templateCache');
    });

    it('should work with $state.go', function() {
      $state.go('requests');
      expect($state.is('requests.explorer'));
    });
  });

  describe('controller', function() {
    var controller;

    var requests = {
      name: 'requests',
      count: 1,
      subcount: 1,
      resources: []
    };

    beforeEach(function() {
      bard.inject('$controller', '$log', '$state', '$rootScope', 'Notifications');

      controller = $controller($state.get('requests.explorer').controller, {requests: requests});
    });

    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });
  });
});

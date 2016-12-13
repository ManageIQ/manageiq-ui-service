describe('Dashboard', function() {
  beforeEach(function() {
    module('app.states', 'app.config', 'gettext', bard.fakeToastr);
    bard.inject('$location', '$rootScope', '$state', '$templateCache', 'Session');
  });

  describe('route', function() {
    beforeEach(function() {
      bard.inject('$location', '$rootScope', '$state', '$templateCache');
    });

    it('should work with $state.go', function() {
      $state.go('services.orders');
      expect($state.is('services.orders'));
    });
  });

  describe('controller', function() {
    var controller;

    var orders = {
      name: 'orders',
      count: 1,
      subcount: 1,
      resources: []
    };

    beforeEach(function() {
      bard.inject('$controller', '$log', '$state', '$rootScope', 'Notifications');

      controller = $controller($state.get('services.orders').controller, {orders: orders});
    });

    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });
  });
});

describe('Dashboard', function() {
  beforeEach(function() {
    module('app.states', 'app.config', 'gettext', bard.fakeToastr);
    bard.inject('$location', '$rootScope', '$state', '$templateCache', 'Session');
  });

  describe('route', function() {
    var views = {
      list: 'app/states/requests/list/list.html'
    };

    beforeEach(function() {
      bard.inject('$location', '$rootScope', '$state', '$templateCache');
    });

    it('should work with $state.go', function() {
      $state.go('services.requests');
      expect($state.is('services.requests'));
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

      controller = $controller($state.get('services.requests').controller, {requests: requests});
    });

    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });
  });
});

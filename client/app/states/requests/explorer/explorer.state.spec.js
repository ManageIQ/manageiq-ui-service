describe('app.states.requestsExplorer', function() {
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
});

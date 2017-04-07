describe('Dashboard', function() {
  beforeEach(function() {
    module('app.states', 'app.services');
    bard.inject('$state');
  });

  describe('route', function() {
    it('should work with $state.go', function() {
      $state.go('services.details');
      expect($state.is('services.details'));
    });
  });

  describe('controller', function() {
    var controller;

    beforeEach(function() {
      bard.inject('$componentController');

      controller = $componentController('serviceExplorer', {});
    });

    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });
  });
});

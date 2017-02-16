describe('Dashboard', function() {
  beforeEach(function() {
    module('app.states', 'app.components');
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
      bard.inject('$componentController', 'RBAC');

      RBAC.setActionFeatures( {
        serviceDelete: {show: true},
        serviceRetireNow: {show: true},
        serviceRetire: {show: true},
        serviceTag: {show: true},
        serviceEdit: {show: true},
        serviceReconfigure: {show: true},
        serviceOwnership: {show: true},
      });
      controller = $componentController('serviceExplorer'), {};
    });

    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });
  });
});

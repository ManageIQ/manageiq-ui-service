describe('Dashboard', function() {
  beforeEach(function() {
    module('app.states', 'app.components', 'app.config', 'gettext', bard.fakeToastr);
    bard.inject('$location', '$rootScope', '$state', '$templateCache', 'Session');
  });

  describe('route', function() {
    var views = {
      list: 'app/states/services/list/list.html'
    };

    beforeEach(function() {
      bard.inject('$location', '$rootScope', '$state', '$templateCache');
    });

    it('should work with $state.go', function() {
      $state.go('services.explorer');
      expect($state.is('services.explorer'));
    });
  });

  describe('controller', function() {
    var controller;

    beforeEach(function() {
      bard.inject('$componentController', '$log', '$state', '$rootScope');

      controller = $componentController('serviceExplorer'), {};
    });

    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });
  });
});

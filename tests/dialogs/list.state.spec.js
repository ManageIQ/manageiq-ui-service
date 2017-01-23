describe('Dashboard', function() {
  beforeEach(function() {
    module('app.states', 'app.config', 'gettext', bard.fakeToastr);
    bard.inject('$location', '$rootScope', '$state', '$templateCache', 'Session');
  });

  describe('route', function() {
    var views = {
      list: 'app/states/dialogs/list/list.html'
    };

    beforeEach(function() {
      bard.inject('$location', '$rootScope', '$state', '$templateCache');
    });

    it('should work with $state.go', function() {
      $state.go('designer.dialogs.list');
      expect($state.is('designer.dialogs.list'));
    });
  });

  describe('controller', function() {
    var controller;
    var dialogs = {
      name: 'dialogs',
      count: 1,
      subcount: 1,
      resources: []
    };

    beforeEach(function() {
      bard.inject('$controller', '$log', '$state', '$rootScope');

      controller = $controller($state.get('designer.dialogs.list').controller, {dialogs: dialogs});
    });

    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });
  });
});

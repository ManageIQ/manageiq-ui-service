describe('Dialogs', function() {
  beforeEach(function() {
    module('app.states', bard.fakeToastr);
    bard.inject('$location', '$rootScope', '$state', '$templateCache', 'Session');
  });

  describe('route', function() {
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
      name: 'services_dialogs',
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

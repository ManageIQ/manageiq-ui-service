describe('Dashboard', function() {
  beforeEach(function() {
    module('app.states');
    bard.inject('$state');
  });

  describe('route', function() {
    var views = {
      list: 'app/states/dialogs/list/list.html'
    };

    it('should work with $state.go', function() {
      $state.go('dialogs.list');
      expect($state.is('dialogs.list'));
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
      bard.inject('$controller');

      controller = $controller($state.get('dialogs.list').controller, {dialogs: dialogs});
    });

    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });
  });
});

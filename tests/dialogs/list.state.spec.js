/* jshint -W117, -W030 */
describe('Dashboard', function() {
  beforeEach(function() {
    module('app.states', bard.fakeToastr);
    bard.inject('$location', '$rootScope', '$state', '$templateCache', 'Session');
  });

  describe('route', function() {
    var views = {
      list: 'app/states/dialogs/list/list.html'
    };

    beforeEach(function() {
      bard.inject('$location', '$rootScope', '$state', '$templateCache');
    });

    xit('should work with $state.go', function() {
      $state.go('dialogs.list');
      $rootScope.$apply();
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
      bard.inject('$controller', '$log', '$state', '$rootScope');

      controller = $controller($state.get('dialogs.list').controller, {dialogs: dialogs});
      $rootScope.$apply();
    });

    xit('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

    describe('after activate', function() {
      xit('should have title of Service List', function() {
        expect(controller.title).to.equal('Dialogs List');
      });
    });
  });
});

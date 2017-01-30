describe('app.states.CatalogsState', function() {

  beforeEach(function () {
    module('app.states');
    bard.inject('$state');
  });

  describe('route', function() {

    beforeEach(function() {
      bard.inject('$state');
    });

    it('should work with $state.go', function() {
      $state.go('catalogs');
      expect($state.is('catalogs'));
    });

  });
});


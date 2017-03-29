describe('Component: reportsExplorer', function() {

  beforeEach(function() {
    module('app.states', 'app.reports');
  });

  describe('with $compile', function() {
    let scope;
    let element;

    beforeEach(inject(function($compile, $rootScope) {
      bard.inject('$state');

      scope = $rootScope.$new();
      element = angular.element('<reports-explorer />');
      $compile(element)(scope);

      scope.$apply();
    }));

    it('should work with $state.go', function() {
      $state.go('reports');
      expect($state.is('reports.explorer'));
    });
  });

  describe('with $componentController', function() {
    let scope;
    let ctrl;

    beforeEach(inject(function($componentController) {
      ctrl = $componentController('reportsExplorer', {$scope: scope}, {});
    }));

    it('is defined', function() {
      expect(ctrl).to.be.defined;
    });
  });
});

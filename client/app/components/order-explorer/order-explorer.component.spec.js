describe('Component: orderExplorer', function() {

  beforeEach(function() {
    module('app');
  });

  describe('with $compile', function() {
    let scope;
    let element;

    beforeEach(inject(function($compile, $rootScope) {
      bard.inject('$state');

      scope = $rootScope.$new();
      element = angular.element('<order-explorer />');
      $compile(element)(scope);

      scope.$apply();
    }));

    it('should work with $state.go', function() {
      $state.go('orders');
      expect($state.is('orders.explorer'));
    });
  });

  describe('with $componentController', function() {
    let scope;
    let ctrl;

    beforeEach(inject(function($componentController) {
      ctrl = $componentController('orderExplorer', {$scope: scope}, {});
    }));

    it('is defined', function() {
      expect(ctrl).to.be.defined;
    });
  });
});

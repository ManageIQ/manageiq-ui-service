describe('Component: orderExplorer', function() {

  beforeEach(function() {
    module('app.states', 'app.orders');
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
    it('is can report back a request state', () => {
      const item = {
        request_state: 'finished',
        status: 'Ok'
      };
      const status = ctrl.requestStatus(item);
      expect(status).to.eq('finished');
    });
    it('is can report back a failed order status', () => {
      const item = {
        request_state: 'finished',
        status: 'Error'
      };
      const status = ctrl.requestStatus(item);
      expect(status).to.eq('Error');
    });
  });
});

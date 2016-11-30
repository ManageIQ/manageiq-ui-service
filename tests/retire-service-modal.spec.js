describe('Retire Service Modal', function() {
  beforeEach(module('app.components', 'gettext'));

  describe('controller', function() {
    var controller;
    var $scope;

    beforeEach(inject(function($rootScope, $injector, $controller) {
      state = $injector.get('RetireServiceModal');
      $scope = $rootScope.$new();

      controller = $controller(state.FactoryController, {
        $scope: $scope,
        services: angular.noop,
        $uibModalInstance: angular.noop,
        CollectionsApi: angular.noop,
        EventNotifications: angular.noop,
      });
    }));

    it('changes visible options when date is changed', function() {
      expect(controller.visibleOptions.length).to.eq(0);

      // Initial digest populates visibleOptions with 'No warning' option
      $scope.$digest();

      expect(controller.visibleOptions.length).to.eq(1);
    });
  });
});

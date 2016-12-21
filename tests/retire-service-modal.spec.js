describe('Retire Service Modal', function() {
  beforeEach(module('app.components', 'gettext'));

  describe('controller', function() {
    var $componentController;
    var $scope;

    beforeEach(inject(function($rootScope, $injector, _$componentController_) {
      $scope = $rootScope.$new();
      var bindings = {resolve:{services:[]}};
      var locals = {
        $scope: $scope,
        services: angular.noop,
        $uibModalInstance: angular.noop,
        CollectionsApi: angular.noop,
        EventNotifications: angular.noop,
      };

      $componentController = _$componentController_;
      ctrl = $componentController('retireServiceModal', locals, bindings);
    }));

    it('changes visible options when date is changed', function() {
      expect(ctrl.visibleOptions.length).to.eq(0);

      // Initial digest populates visibleOptions with 'No warning' option
      $scope.$digest();

      expect(ctrl.visibleOptions.length).to.eq(1);
    });
  });
});

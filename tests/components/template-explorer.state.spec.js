describe('Component: templateExplorer', function() {

  beforeEach(function() {
    module('app');
  });

  describe('with $compile', function() {
    let scope;
    let element;

    beforeEach(inject(function($compile, $rootScope) {
      bard.inject('$state','$httpBackend');
      $httpBackend.whenGET('').respond(200);
      scope = $rootScope.$new();
      element = angular.element('<template-explorer />');
      $compile(element)(scope);

      scope.$apply();
    }));

    it('should work with $state.go', function() {
      $state.go('templates');
      expect($state.is('templates.explorer'));
    });
  });

  describe('with $componentController', function() {
    let scope;
    let ctrl;

    beforeEach(inject(function($componentController,$httpBackend) {
      $httpBackend.whenGET('').respond(200);

      ctrl = $componentController('templateExplorer', {$scope: scope}, {});
    }));

    it('is defined', function() {
      expect(ctrl).to.be.defined;
    });
  });
});

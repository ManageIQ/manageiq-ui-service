describe('Component: reportsDetails', function() {

  beforeEach(function() {
    module('app.states','app.core', 'app.reports');
  });

  describe('with $compile', function() {
    let scope;
    let element;
    let getReportSpy;
    let mockDir = 'tests/mock/reports/';

    beforeEach(inject(function($compile, $rootScope) {
      bard.inject('ReportsService', '$state', '$httpBackend');
      scope = $rootScope.$new();
      scope.report = readJSON(mockDir + 'report.json');
      element = angular.element('<reports-details report="report"/>');
      $compile(element)(scope);
      $httpBackend.whenGET('').respond(200);
      scope.reportRuns = readJSON(mockDir + 'report.details.json');
      getReportSpy = sinon.stub(ReportsService, 'getReportRuns').returns(Promise.resolve(scope.reportRuns));

      scope.$apply();
    }));

    xit('should work with $state.go', function() {
      $state.go('reports.details',{reportId:'10000000000375'});
      expect($state.is('reports.details'));
    });
  });
});

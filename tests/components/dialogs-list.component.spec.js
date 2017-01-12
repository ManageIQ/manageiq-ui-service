describe('Component: dialogsList', function() {

  let dialogs =  [
    {
      "updated_at": "2001-03-28T23:19:35Z",
      "label": "azure-single-vm-from-user-image",
    },
    {
      "updated_at": "2016-07-27T23:29:25Z",
      "label": "Hybrid Cloud Application",
    },
    {
      "updated_at": "2016-08-23T22:57:46Z",
      "label": "Create VM (RHEV)",
    },
    {
      "updated_at": "2000-02-20T00:01:27Z",
      "label": "RHEL7 with PostgreSQL",
    },
    {
      "updated_at": "2016-09-23T22:58:00Z",
      "label": "Create VM (VMware)",
    },
    {
      "updated_at": "2016-08-23T23:10:54Z",
      "label": "Create VM (EC2)",
    },
  ];

  beforeEach(function() {
    module('app.components', 'gettext');
  });

  describe('with $compile', function() {
    let scope;
    let element;

    beforeEach(inject(function($compile, $rootScope) {
      scope = $rootScope.$new();
      element = angular.element('<dialogs-list dialogs="dialogs"/>');
      $compile(element)(scope);

      scope.dialogs = dialogs;
      scope.$apply();
    }));

    it('should have correct number of rows', function() {
      var rows = element.find('#dialogList .list-group-item');
      expect(rows.length).to.eq(scope.dialogs.length);
    });

    it('should sort the dialogs appropriately', function() {
      // Default sort is by name
      var nameSpans = element.find('.list-view-pf-main-info > .row > .col-md-4 > span');
      expect(nameSpans.length).to.eq(6);
      expect(nameSpans[0].innerHTML.trim()).to.eq("azure-single-vm-from-user-image");

      var sortItems = element.find('.sort-pf .sort-field');
      expect(sortItems.length).to.eq(2);

      // Sort by date updated
      eventFire(angular.element(sortItems[1]), 'click');
      scope.$apply();

      nameSpans = element.find('.list-view-pf-main-info > .row > .col-md-4 > span');
      expect(nameSpans.length).to.eq(6);
      expect(nameSpans[0].innerHTML.trim()).to.eq('RHEL7 with PostgreSQL');
    });
  });

  describe('with $componentController', function() {
    let scope;
    let ctrl;

    beforeEach(inject(function($componentController) {
      ctrl = $componentController('dialogsList', {$scope: scope}, {dialogs: dialogs});
    }));

    it('is defined', function() {
      expect(ctrl).to.be.defined;
    });
  });
});

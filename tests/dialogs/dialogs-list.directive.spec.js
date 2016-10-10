describe('app.components.DialogsListDirective', function() {
  var $scope;
  var $compile;
  var element;

  beforeEach(function () {
    module('app.services', 'app.config', 'app.states', 'app.components', 'gettext');
    bard.inject('DialogsState', '$state', 'Session', '$httpBackend', '$timeout');
  });

  beforeEach(inject(function (_$compile_, _$rootScope_, _$document_) {
    $compile = _$compile_;
    $scope = _$rootScope_;
    $document = _$document_;
  }));

  var compileHTML = function (markup, scope) {
    element = angular.element(markup);
    $compile(element)(scope);

    scope.$digest();
  };

  beforeEach(function () {
    Session.create({
      auth_token: 'b10ee568ac7b5d4efbc09a6b62cb99b8',
    });
    $httpBackend.whenGET('').respond(200);

    $scope.dialogs = [
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

    var htmlTmp = '<dialogs-list dialogs="dialogs"></dialogs-list>';

    compileHTML(htmlTmp, $scope);
  });

  describe('dialogList', function() {
    it('should have correct number of rows', function () {
      var rows = element.find('#dialogList .list-group-item');
      expect(rows.length).to.eq($scope.dialogs.length);
    });

    it('should sort the dialogs appropriately', function () {
      // Default sort is by name
      var nameSpans = element.find('.list-view-pf-main-info > .row > .col-md-4 > span');
      expect(nameSpans.length).to.eq(6);
      expect(nameSpans[0].innerHTML).to.eq("azure-single-vm-from-user-image");

      var sortItems = element.find('.sort-pf .sort-field');
      expect(sortItems.length).to.eq(2);

      // Sort by date updated
      eventFire(angular.element(sortItems[1]), 'click');
      $scope.$digest();

      nameSpans = element.find('.list-view-pf-main-info > .row > .col-md-4 > span');
      expect(nameSpans.length).to.eq(6);
      expect(nameSpans[0].innerHTML).to.eq('RHEL7 with PostgreSQL');
    });
  });
});

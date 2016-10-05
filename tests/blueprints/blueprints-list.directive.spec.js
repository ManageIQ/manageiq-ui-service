describe('app.components.blueprints.BlueprintsListDirective', function() {
  var $scope;
  var $compile;
  var element;
  var successResponse = {
    message: 'Success!'
  };

  beforeEach(function () {
    module('app.services', 'app.config', 'app.states', 'gettext');
    bard.inject('BlueprintsState', '$state', 'Session', '$httpBackend');
  });

  beforeEach(inject(function (_$compile_, _$rootScope_, _$document_) {
    $compile = _$compile_;
    $scope = _$rootScope_;
    $document = _$document_
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

    var mockDir = 'tests/mock/blueprints-list/';
    $scope.blueprints = readJSON(mockDir + 'blueprints-list.json');
    $scope.serviceCatalogs = readJSON(mockDir + 'service-catalogs.json');
    $scope.tenants = readJSON(mockDir + 'tenants.json');

    var htmlTmp = '<blueprints-list blueprints="blueprints" service-catalogs="serviceCatalogs" tenants="tenants"/>';

    compileHTML(htmlTmp, $scope);
  });

  describe('Blueprints List', function() {
    it('should have correct number of rows', function () {
      var rows = element.find('.list-view-pf > .list-group-item');
      expect(rows.length).to.eq($scope.blueprints.length);
    });

    it('should have gotten catalog names from catalog ids', function () {
      var catName0 = element.find('#catalogName_0');
      var catName1 = element.find('#catalogName_1');
      var catName2 = element.find('#catalogName_2');

      expect(catName0.html()).to.eq("Amazon Operations");
      expect(catName1.html()).to.eq("OpenStack Operations");
      expect(catName2.text()).to.eq("Unassigned");
    });

    it('should display the correct Visibility icons', function () {
      var publicIcon = element.find('.fa.fa-globe');
      var privateIcon = element.find('.pficon.pficon-private');
      var tenantIcon = element.find('.pficon.pficon-tenant');

      expect(publicIcon.length).to.eq(1);
      expect(privateIcon.length).to.eq(1);
      expect(tenantIcon.length).to.eq(1);
    });

    it('should enable/disable delete blueprint button', function () {
      var rows = element.find('.list-view-pf > .list-group-item');
      expect(rows.length).to.eq($scope.blueprints.length);

      var disabledDeleteButton = element.find('.primary-action[disabled]');
      expect(disabledDeleteButton.length).to.eq(1);

      var checkboxes = rows.find('input');
      expect(checkboxes.length).to.eq(3);

      checkboxes[0].click();
      $scope.$digest();

      disabledDeleteButton = element.find('.primary-action[disabled]');
      expect(disabledDeleteButton.length).to.eq(0);
    });

    it('should enable/disable inline publish buttons', function () {

      var rows = element.find('.list-view-pf > .list-group-item');
      expect(rows.length).to.eq($scope.blueprints.length);

      // When 0 Items on Canvas, Publish button is disabled
      var secondRowNumItems = element.find('#numItems_1');
      var secondRowNumItemsStr = angular.element(secondRowNumItems[0]).html();
      secondRowNumItemsStr = secondRowNumItemsStr.substr(0,secondRowNumItemsStr.indexOf(' '));
      expect(secondRowNumItemsStr).to.eq('0');

      var disabledPublishButton = angular.element(rows[1]).find('.btn.btn-default.disabled');
      expect(disabledPublishButton.length).to.eq(1);

      // Third row has 3 Items on Canvas, so publish button should be enabled
      disabledPublishButton = angular.element(rows[2]).find('.btn.btn-default.disabled');
      expect(disabledPublishButton.length).to.eq(0);
    });
  });
});

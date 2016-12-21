describe('app.components.blueprints.BlueprintsListDirective', function() {
  let $scope;
  let $compile;
  let $document;
  let element;
  let successResponse = {
    message: 'Success!'
  };

  beforeEach(function () {
    module('app.services', 'app.config', 'app.states', 'gettext');
    bard.inject('BlueprintsState', 'CollectionsApi', 'BlueprintDetailsModal', '$state', 'Session', '$httpBackend');
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

      // row 0 = 'Blueprint One' - published
      // row 1 = 'Blueprint Three' - no items on canvas
      // row 2 = 'Blueprint Two' - 3 item on canvas

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

    it('should list unpublished and published blueprints correctly', function () {

      // row 0 = 'Blueprint One' - published
      // row 1 = 'Blueprint Three' - no items on canvas
      // row 2 = 'Blueprint Two' - 3 item on canvas

      var rows = element.find('.list-view-pf > .list-group-item');
      expect(rows.length).to.eq($scope.blueprints.length);

      // 1st row is 'published'
      var rowStatus = element.find('#status_0');
      var rowStatusStr = angular.element(rowStatus[0]).text();
      expect(rowStatusStr).to.eq('Published');
      var disabledPublishButton = angular.element(rows[0]).find('.btn.btn-default.disabled');
      expect(disabledPublishButton.length).to.eq(1);
      expect($scope.blueprints[0].read_only).to.eq(true);

      // 2nd row is unpublished, and shouldn't be read-only
      expect($scope.blueprints[1].read_only).to.eq(false);

      // 3rd row is 'draft' and valid for publication
      rowStatus = element.find('#status_2');
      rowStatusStr = angular.element(rowStatus[0]).text();
      expect(rowStatusStr).to.eq('Draft');
      disabledPublishButton = angular.element(rows[2]).find('.btn.btn-default.disabled');
      expect(disabledPublishButton.length).to.eq(0);
      expect($scope.blueprints[2].read_only).to.eq(false);
    });

    it('should goto the blueprint editor when a blueprint is clicked', function () {
      var stateGoSpy = sinon.spy($state, 'go');
      var rows = element.find('.list-view-pf > .list-group-item');
      expect(rows.length).to.eq($scope.blueprints.length);

      var rowElement = angular.element(rows[0]);

      var rowInfo = rowElement.find('.list-view-pf-main-info');
      expect(rowInfo.length).to.eq(1);

      eventFire(angular.element(rowInfo[0]), 'click');
      $scope.$digest();

      expect(stateGoSpy).to.have.been.calledWith('designer.blueprints.editor', { blueprintId: 10000000000023 });
    });

    it('should goto the blueprint editor when Create button clicked', function () {
      var stateGoSpy = sinon.spy($state, 'go');
      var btns = element.find('.primary-action');
      expect(btns.length).to.eq(2);
      var createBtn = btns[0];
      createBtn.click();
      expect(stateGoSpy).to.have.been.calledWith('designer.blueprints.editor');
    });

    it('should disable Publish when there are no items on canvas ', function () {
      var rows = element.find('.list-view-pf > .list-group-item');
      expect(rows.length).to.eq($scope.blueprints.length);

      // 2nd row/blueprint doesn't have any nodes on canvas
      var rowElement = angular.element(rows[1]);

      var publishBtn = rowElement.find('.disabled');
      expect(publishBtn.length).to.eq(1);
    });

    it('should launch the publish dlg when Publish button clicked', function (done) {
      var collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse));
      var BlueprintDetailsModalSpy = sinon.stub(BlueprintDetailsModal, 'showModal').returns(Promise.resolve());

      var rows = element.find('.list-view-pf > .list-group-item');
      expect(rows.length).to.eq($scope.blueprints.length);

      var rowElement = angular.element(rows[0]);

      var publishBtn = rowElement.find('.btn-default');
      expect(publishBtn.length).to.eq(1);

      publishBtn[0].click();
      $scope.$digest();
      done();

      expect(collectionsApiSpy).to.have.been.called;
      expect(BlueprintDetailsModalSpy).to.have.been.called;
    });
  });
});

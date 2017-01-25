describe('Component: ServiceDetails', function() {

  beforeEach(function() {
    module('app.components');
    bard.inject('ServicesState', 'Session', '$httpBackend', '$state', '$timeout');
  });

  describe('view', function() {
    let scope;
    let isoScope;
    let element;

    beforeEach(inject(function($compile, $rootScope) {
      let mockDir = 'tests/mock/services/';

      scope = $rootScope.$new();

      element = angular.element('<service-details service="service" tags="tags"/>');
      $compile(element)(scope);

      Session.create({
        auth_token: 'b10ee568ac7b5d4efbc09a6b62cb99b8',
      });
      $httpBackend.whenGET('').respond(200);

      $state.actionFeatures = {
        serviceDelete: {show: true},
        serviceRetireNow: {show: true},
        serviceRetire: {show: true},
        serviceTag: {show: true},
        serviceEdit: {show: true},
        serviceReconfigure: {show: true},
        serviceOwnership: {show: true},
      };

      scope.service = readJSON(mockDir + 'service1.json');
      scope.tags = readJSON(mockDir + 'service1_tags.json');

      scope.$apply();
      isoScope = element.isolateScope();
    }));

    it('should have show the correct properties', function() {
      var readonlyInputs = element.find('.form-control');
      expect(readonlyInputs.length).to.eq(7);
      expect(readonlyInputs[0].value).to.eq('RHEL7 on VMware');
      expect(readonlyInputs[1].value).to.eq('10000000000542');
      expect(readonlyInputs[2].value).to.eq('Administrator');
      expect(readonlyInputs[3].value).to.eq('$0.000');
      expect(readonlyInputs[4].value).to.eq('Nov 18, 2016 12:00:00 AM');
      expect(readonlyInputs[5].value).to.eq('Unknown');
      expect(readonlyInputs[6].value).to.eq('Oct 21, 2017');

      var tagsControl = element.find('.ss-form-readonly .service-details-tag-control');
      expect(tagsControl.length).to.eq(1);

      var tags = angular.element(tagsControl[0]).find('.label-info');
      expect(tags.length).to.eq(2);
      expect(tags[0].innerHTML.indexOf("Environment: Development")).to.not.eq(-1);
      expect(tags[1].innerHTML.indexOf("Workload: app")).to.not.eq(-1);
    });

    it('should have show the correct resources', function() {
      var resourceTitles = element.find('.service-details-resource-group-title');
      expect(resourceTitles.length).to.eq(1);
      expect(resourceTitles[0].innerHTML).to.eq(" Compute (1) ");

      var resourceItems = element.find('.service-details-resource-list-container .list-group-item');
      expect(resourceItems.length).to.eq(1);

      var powerIcon = angular.element(resourceItems[0]).find('.pficon.pficon-ok');
      expect(powerIcon.length).to.eq(1);

      var typeIcon = angular.element(resourceItems[0]).find('.pficon.pficon-screen');
      expect(typeIcon.length).to.eq(1);

      var name = angular.element(resourceItems[0]).find('.name-column > span > a > span');
      expect(name.length).to.eq(1);
      expect(name[0].innerHTML).to.eq(" demo-iot-2 ");
    });

    it('should have show the correct relationships', function() {
      var relationshipsPanel = element.find('.relationships-panel');
      expect(relationshipsPanel.length).to.eq(1);

      var rows = angular.element(relationshipsPanel[0]).find('.row');
      expect(rows.length).to.eq(1);

      var columns = angular.element(rows[0]).find('.col-sm-4');
      expect(columns.length).to.eq(3);

      var relationShipName = angular.element(columns[0]).find('a');
      expect(relationShipName[0].innerHTML).to.eq('RHEL7 on VMware');

      expect(columns[1].innerHTML).to.eq('Parent Catalog Item');

      var description = angular.element(columns[2]).find('span');
      expect(description[0].innerHTML).to.eq('RHEL7 on VMware');
    });

    it('should allow approprate actions', function() {
      var actionsPanel = element.find('.ss-details-header__actions');
      expect(actionsPanel.length).to.eq(1);

      var actionButtons = angular.element(actionsPanel[0]).find('.custom-dropdown');
      expect(actionButtons.length).to.eq(4);

      var powerButtons = angular.element(actionButtons[0]).find('.dropdown-menu > li');
      expect(powerButtons.length).to.eq(3);

      var startButton = angular.element(powerButtons[0]);
      var stopButton = angular.element(powerButtons[1]);
      var suspendButton = angular.element(powerButtons[2]);

      expect(startButton.hasClass('disabled')).to.eq(false);
      expect(stopButton.hasClass('disabled')).to.eq(true);
      expect(suspendButton.hasClass('disabled')).to.eq(true);
    });
  });
});

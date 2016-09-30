describe('app.components.ProfilesDetailsDirective', function() {
  var $scope;
  var $compile;
  var element;

  beforeEach(function () {
    module('app.services', 'app.config', 'app.states', 'app.components', 'gettext');
    bard.inject('$state', 'Session', '$httpBackend', 'ProfilesState');
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

    $scope.profile = {
      id: '1',
      name: 'Test Profile',
      description: 'Test Description',
      ext_management_system: {
        id: '1',
        name: 'Test Provider',
        type: 'amazon'
      },
      created_at: 0,
      updated_at: 0,
      authentication: {
        name: 'Test Key Pair',
      },
      cloud_network: {
        name: 'Test Cloud Network',
      },
      cloud_subnet: {
        name: 'Test Cloud Subnet',
      },
      flavor: {
        name: 'Test Flavor',
      },
      availability_zone: {
        name: 'Test Availability Zone',
      },
      security_group: {
        name: 'Test Security Group'
      },
    };

    var htmlTmp = '<profile-details profile="profile"></div>';

    compileHTML(htmlTmp, $scope);
  });

  describe('profileDetails', function() {

    it('should have the correct provider icon', function () {
      var title = element.find('.ss-details-header__title-img__logo');
      expect(title.length).to.eq(1);

      expect(angular.element(title[0]).attr('src')).to.eq('assets/images/providers/vendor-amazon.svg');
    });

    it('should have the correct title', function () {
      var title = element.find('.ss-details-header__title h2');
      expect(title.length).to.eq(1);

      expect(title[0].innerHTML).to.eq($scope.profile.name);
    });

    it('should have the correct description', function () {
      var title = element.find('.ss-details-header__title h4');
      expect(title.length).to.eq(1);

      expect(title[0].innerHTML).to.eq($scope.profile.description);
    });

    it('should have the correct readonly detail values', function () {
      var values = element.find('.ss-form-readonly .form-group .form-control');
      expect(values.length).to.eq(10);
      expect(values[2].value).to.eq(ProfilesState.getProviderType($scope.profile.ext_management_system));
      expect(values[3].value).to.eq($scope.profile.ext_management_system.name);
      expect(values[4].value).to.eq($scope.profile.authentication.name);
      expect(values[5].value).to.eq($scope.profile.availability_zone.name);
      expect(values[6].value).to.eq($scope.profile.flavor.name);
      expect(values[7].value).to.eq($scope.profile.cloud_network.name);
      expect(values[8].value).to.eq($scope.profile.cloud_subnet.name);
      expect(values[9].value).to.eq($scope.profile.security_group.name);
    });

    it('should edit a profile when the edit button is clicked', function () {
      var stateGoSpy = sinon.spy($state, 'go');

      var editButton = element.find('.ss-details-panel .ss-details-section .btn-primary');
      expect(editButton.length).to.eq(1);

      eventFire(angular.element(editButton[0]), 'click');
      $scope.$digest();

      expect(stateGoSpy).to.have.been.calledWith('administration.profiles.editor', { profileId: "1" });
    });
  });
});

describe('app.components.ProfileEditorDirective', function() {
  var $scope;
  var $compile;
  var element;

  beforeEach(function() {
    module('app.services', 'app.config', 'app.states', 'app.components', 'gettext');
    bard.inject('$state', 'Session', '$httpBackend', 'ProfilesState', 'SaveModalDialog', '$timeout');
  });

  beforeEach(inject(function(_$compile_, _$rootScope_, _$document_) {
    $compile = _$compile_;
    $scope = _$rootScope_;
    $document = _$document_
  }));

  var compileHTML = function(markup, scope) {
    element = angular.element(markup);
    $compile(element)(scope);

    scope.$digest();
  };

  beforeEach(function() {
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
        name: 'Test Provider 1',
        type: 'amazon'
      },
      created_at: 0,
      updated_at: 0,
      authentication: {
        id: '1',
        name: 'Test Key Pair 1',
      },
      availability_zone: {
        id: '1',
        name: 'Test Availability Zone 1',
      },
      flavor: {
        id: '1',
        name: 'Test Flavor 1',
      },
      cloud_network: {
        id: '1',
        name: 'Test Cloud Network 1',
      },
      cloud_subnet: {
        id: '1',
        name: 'Test Cloud Subnet 1',
      },
      security_group: {
        id: '1',
        name: 'Test Security Group 1'
      },
    };

    $scope.providers = [
      {
        id: '1',
        name: 'Test Provider 1',
        type: 'amazon',
        key_pairs: [
          {
            id: '1',
            name: 'Test Key Pair 1',
          },
          {
            id: '2',
            name: 'Test Key Pair 2',
          },
          {
            id: '3',
            name: 'Test Key Pair 3',
          },],
        availability_zones: [
          {
            id: '1',
            name: 'Test Availability Zone 1',
          },
          {
            id: '2',
            name: 'Test Availability Zone 2',
          },
          {
            id: '3',
            name: 'Test Availability Zone 3',
          },
        ],
        flavors: [
          {
            id: '1',
            name: 'Test Flavor 1',
          },
          {
            id: '2',
            name: 'Test Flavor 2',
          },
          {
            id: '3',
            name: 'Test Flavor 3',
          },
        ],
        cloud_networks: [
          {
            id: '1',
            name: 'Test Cloud Network 1',
          },
          {
            id: '2',
            name: 'Test Cloud Network 2',
          },
          {
            id: '3',
            name: 'Test Cloud Network 3',
          },
        ],
      },
      {
        id: '2',
        name: 'Test Provider 2',
        type: 'azure',
        key_pairs: [
          {
            id: '1',
            name: 'Test Key Pair 1',
          },
          {
            id: '2',
            name: 'Test Key Pair 2',
          },
          {
            id: '3',
            name: 'Test Key Pair 3',
          },],
        availability_zones: [
          {
            id: '1',
            name: 'Test Availability Zone 1',
          },
          {
            id: '2',
            name: 'Test Availability Zone 2',
          },
          {
            id: '3',
            name: 'Test Availability Zone 3',
          },
        ],
        flavors: [
          {
            id: '1',
            name: 'Test Flavor 1',
          },
          {
            id: '2',
            name: 'Test Flavor 2',
          },
          {
            id: '3',
            name: 'Test Flavor 3',
          },
        ],
        cloud_networks: [
          {
            id: '1',
            name: 'Test Cloud Network 1',
          },
          {
            id: '2',
            name: 'Test Cloud Network 2',
          },
          {
            id: '3',
            name: 'Test Cloud Network 3',
          },
        ],
      },
      {
        id: '3',
        name: 'Test Provider 3',
        type: 'google',
        key_pairs: [
          {
            id: '1',
            name: 'Test Key Pair 1',
          },
          {
            id: '2',
            name: 'Test Key Pair 2',
          },
          {
            id: '3',
            name: 'Test Key Pair 3',
          },],
        availability_zones: [
          {
            id: '1',
            name: 'Test Availability Zone 1',
          },
          {
            id: '2',
            name: 'Test Availability Zone 2',
          },
          {
            id: '3',
            name: 'Test Availability Zone 3',
          },
        ],
        flavors: [
          {
            id: '1',
            name: 'Test Flavor 1',
          },
          {
            id: '2',
            name: 'Test Flavor 2',
          },
          {
            id: '3',
            name: 'Test Flavor 3',
          },
        ],
        cloud_networks: [
          {
            id: '1',
            name: 'Test Cloud Network 1',
          },
          {
            id: '2',
            name: 'Test Cloud Network 2',
          },
          {
            id: '3',
            name: 'Test Cloud Network 3',
          },
        ],
      },
    ];

    $scope.cloudNetworks = [
      {
        id: "1",
        name: 'Test Cloud Network 1',
        cloud_subnets: [
          {
            id: '1',
            name: 'Test Cloud Subnet 1',
          },
          {
            id: '2',
            name: 'Test Cloud Subnet 2',
          },
          {
            id: '3',
            name: 'Test Cloud Subnet 3',
          },
        ],
        security_groups: [
          {
            id: '1',
            name: 'Test Security Group 1'
          },
          {
            id: '2',
            name: 'Test Security Group 2'
          },
          {
            id: '3',
            name: 'Test Security Group 3'
          },
        ]
      },
      {
        id: "2",
        name: 'Test Cloud Network 2',
        cloud_subnets: [
          {
            id: '1',
            name: 'Test Cloud Subnet 1',
          },
          {
            id: '2',
            name: 'Test Cloud Subnet 2',
          },
          {
            id: '3',
            name: 'Test Cloud Subnet 3',
          },
        ],
        security_groups: [
          {
            id: '1',
            name: 'Test Security Group 1'
          },
          {
            id: '2',
            name: 'Test Security Group 2'
          },
          {
            id: '3',
            name: 'Test Security Group 3'
          },
        ]
      },
      {
        id: "3",
        name: 'Test Cloud Network 3',
        cloud_subnets: [
          {
            id: '1',
            name: 'Test Cloud Subnet 1',
          },
          {
            id: '2',
            name: 'Test Cloud Subnet 2',
          },
          {
            id: '3',
            name: 'Test Cloud Subnet 3',
          },
        ],
        security_groups: [
          {
            id: '1',
            name: 'Test Security Group 1'
          },
          {
            id: '2',
            name: 'Test Security Group 2'
          },
          {
            id: '3',
            name: 'Test Security Group 3'
          },
        ]
      }
    ];

    var htmlTmp = '<profile-editor profile="profile" providers="providers" cloud-networks="cloudNetworks">';
    compileHTML(htmlTmp, $scope);
    $scope.$digest();
  });

  describe('profileEditor', function() {

    it('should have the correct initial values', function() {
      var values = element.find('.ss-form .form-group .form-control');
      expect(values.length).to.eq(2);

      expect(values[0].value).to.eq($scope.profile.name);
      expect(values[1].value).to.eq($scope.profile.description);

      var options = element.find('.ss-form .form-group .filter-option');
      expect(options.length).to.eq(8);
      expect(options[0].innerHTML).to.eq(ProfilesState.getProviderType($scope.profile.ext_management_system));
      expect(options[1].innerHTML).to.eq($scope.profile.ext_management_system.name);
      expect(options[2].innerHTML).to.eq($scope.profile.authentication.name);
      expect(options[3].innerHTML).to.eq($scope.profile.availability_zone.name);
      expect(options[4].innerHTML).to.eq($scope.profile.flavor.name);
      expect(options[5].innerHTML).to.eq($scope.profile.cloud_network.name);
      expect(options[6].innerHTML).to.eq($scope.profile.cloud_subnet.name);
      expect(options[7].innerHTML).to.eq($scope.profile.security_group.name);

    });

    it('should have the correct option values', function() {
      var options = element.find('.ss-form .form-group .bootstrap-select .dropdown-menu.inner');
      expect(options.length).to.eq(8);

      var providerTypeOptions = angular.element(options[0]).find('span.text');
      expect(providerTypeOptions.length).to.eq(4);
      expect(providerTypeOptions[1].innerHTML).to.eq(ProfilesState.getProviderType($scope.providers[0]));
      expect(providerTypeOptions[2].innerHTML).to.eq(ProfilesState.getProviderType($scope.providers[1]));
      expect(providerTypeOptions[3].innerHTML).to.eq(ProfilesState.getProviderType($scope.providers[2]));

      function validateNameChoices(parent, nameOptions) {
        var choices = angular.element(parent).find('span.text');
        expect(choices.length).to.eq(nameOptions.length + 1);
        for (var i = 1; i < choices.length; i++) {
          expect(choices[i].innerHTML).to.eq(nameOptions[i - 1].name);
        }
      }

      var providerOptions = angular.element(options[1]).find('span.text');
      expect(providerOptions.length).to.eq(2);
      expect(providerOptions[1].innerHTML).to.eq('Test Provider 1');

      validateNameChoices(options[2], $scope.providers[0].key_pairs);
      validateNameChoices(options[3], $scope.providers[0].availability_zones);
      validateNameChoices(options[4], $scope.providers[0].flavors);
      validateNameChoices(options[5], $scope.providers[0].cloud_networks);
      validateNameChoices(options[6], $scope.cloudNetworks[0].cloud_subnets);
      validateNameChoices(options[7], $scope.cloudNetworks[0].security_groups);
    });

    it('should disable the save button when there are no changes, enable when changes are made', function() {
      var saveButton = element.find('.ss-details-panel .ss-details-section .btn-primary');
      expect(saveButton.length).to.eq(1);

      expect(saveButton.attr('disabled')).to.eq('disabled');

      var options = element.find('.ss-form .form-group .bootstrap-select .dropdown-menu.inner');
      expect(options.length).to.eq(8);

      var keyPairOptions = angular.element(options[2]).find('span.text');

      eventFire(angular.element(keyPairOptions[3]).parent(), 'click');
      $scope.$digest();

      saveButton = element.find('.ss-details-panel .ss-details-section .btn-primary');
      expect(saveButton.length).to.eq(1);

      expect(saveButton.attr('disabled')).to.eq(undefined);
    });

    it('should go back to details when cancelled', function() {
      var stateGoSpy = sinon.spy($state, 'go');

      var cancelButton = element.find('.ss-details-panel .ss-details-section .btn-default');
      expect(cancelButton.length).to.eq(1);

      eventFire(angular.element(cancelButton[0]), 'click');
      $scope.$digest();

      expect(stateGoSpy).to.have.been.calledWith('administration.profiles.details', {profileId: "1"});
    });

    it('should ask for confirmation when cancelling after edits are made', function() {
      $state.go('administration.profiles.editor');
      var stateGoSpy = sinon.spy($state, 'go');
      var saveModalSpy = sinon.stub(SaveModalDialog, 'showModal').returns(Promise.resolve());
      var options = element.find('.ss-form .form-group .bootstrap-select .dropdown-menu.inner');
      expect(options.length).to.eq(8);

      var keyPairOptions = angular.element(options[2]).find('span.text');

      eventFire(angular.element(keyPairOptions[3]).parent(), 'click');
      $scope.$digest();

      var saveButton = element.find('.ss-details-panel .ss-details-section .btn-primary');
      expect(saveButton.length).to.eq(1);

      expect(saveButton.attr('disabled')).to.eq(undefined);

      var cancelButton = element.find('.ss-details-panel .ss-details-section .btn-default');
      expect(cancelButton.length).to.eq(1);

      eventFire(angular.element(cancelButton[0]), 'click');
      $scope.$digest();

      expect(stateGoSpy).to.have.been.calledWith('administration.profiles.details', {profileId: "1"});
      expect(saveModalSpy).to.have.been.called;
    });

    it('should call the service to save when save is pressed', function() {
      var profilesStateSpy = sinon.stub(ProfilesState, 'editProfile').returns(Promise.resolve({message: 'success'}));

      var options = element.find('.ss-form .form-group .bootstrap-select .dropdown-menu.inner');
      expect(options.length).to.eq(8);

      var keyPairOptions = angular.element(options[2]).find('span.text');

      eventFire(angular.element(keyPairOptions[3]).parent(), 'click');
      $scope.$digest();

      var saveButton = element.find('.ss-details-panel .ss-details-section .btn-primary');
      expect(saveButton.length).to.eq(1);

      expect(saveButton.attr('disabled')).to.eq(undefined);

      eventFire(saveButton[0], 'click');
      $scope.$digest();

      expect(profilesStateSpy).to.have.been.called;
    })
  });
});

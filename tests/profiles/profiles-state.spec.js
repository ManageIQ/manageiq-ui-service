describe('app.states.ProfilesState', function() {
  beforeEach(function () {
    module('app.services', 'app.config', 'app.states', 'gettext');
    bard.inject('$location', '$rootScope', '$state', '$templateCache', 'Session', '$httpBackend');
  });

  beforeEach(function () {
    Session.create({
      auth_token: 'b10ee568ac7b5d4efbc09a6b62cb99b8',
    });
    $httpBackend.whenGET('').respond(200);
  });

  describe('route', function() {

    beforeEach(function() {
      bard.inject('$state');
    });

    it('should work with $state.go', function() {
      $state.go('administration.rules');
      $rootScope.$apply();
      expect($state.is('administration.rules'));
    });

  });

  describe('controller', function() {

    var arbitrationProfiles = {
      resources: [
        {
          id: '1',
          name: '1',
        },
        {
          id: '2',
          name: '2',
        },
        {
          id: '3',
          name: '3',
        }
      ]
    };

    beforeEach(function() {
      bard.inject('$controller', '$state', '$rootScope', '$document', 'ProfilesState');
    });

    it('should get Profiles from the API when viewing profiles list', function () {
      var getProfilesSpy = sinon.stub(ProfilesState, 'getProfiles').returns(Promise.resolve(arbitrationProfiles));

      $state.go('administration.profiles');
      $rootScope.$apply();

      expect(getProfilesSpy).to.have.been.called;
    });

    it('should get Profile Details from the API when viewing profile details', function () {
      var getProfilesSpy = sinon.stub(ProfilesState, 'getProfileDetails').returns(Promise.resolve(arbitrationProfiles.resources[0]));

      $state.go('administration.profiles.details');
      $rootScope.$apply();

      expect(getProfilesSpy).to.have.been.called;
    });

    it('should get required data from the API when editing a profiles', function () {
      var getProfilesSpy = sinon.stub(ProfilesState, 'getProfileDetails').returns(Promise.resolve(arbitrationProfiles.resources[0]));
      var getProvidersSpy = sinon.stub(ProfilesState, 'getProviders').returns(Promise.resolve({}));
      var getCloudNetworksSpy = sinon.stub(ProfilesState, 'getCloudNetworks').returns(Promise.resolve({}));

      $state.go('administration.profiles.editor', {profileId: '1'});
      $rootScope.$apply();

      expect(getProfilesSpy).to.have.been.called;
      expect(getProvidersSpy).to.have.been.called;
      expect(getCloudNetworksSpy).to.have.been.called;
    });
  });
});


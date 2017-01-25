describe('app.services.ProfilesState', function() {
  beforeEach(function () {
    module('app.services', 'app.states');
  });

  describe('service', function () {
    var collectionsApiSpy;
    var notificationsErrorSpy;
    var notificationsSuccessSpy;
    var successResponse = {
      message: "Success"
    };
    var errorResponse = 'error';

    beforeEach(function () {
      bard.inject('ProfilesState', 'CollectionsApi', 'EventNotifications', '$rootScope');

      notificationsSuccessSpy = sinon.stub(EventNotifications, 'success').returns(null);
      notificationsErrorSpy = sinon.stub(EventNotifications, 'error').returns(null);
    });

    it('should return the proper provider types and images', function() {
      var amazonObject = {type: 'test-Amazon-provider'};
      var azureObject = {type: 'test-Azure-provider'};
      var googleObject = {type: 'test-Google-provider'};
      var openstackObject = {type: 'test-Openstack-provider'};
      var vmWareObject ={type: 'test-Vmware-provider'};
      var unknownObject ={type: 'test-abcdefg-provider'};

      expect(ProfilesState.getProviderType(amazonObject)).to.eq('Amazon EC2');
      expect(ProfilesState.getProviderType(azureObject)).to.eq('Azure');
      expect(ProfilesState.getProviderType(googleObject)).to.eq('Google Compute Engine');
      expect(ProfilesState.getProviderType(openstackObject)).to.eq('OpenStack');
      expect(ProfilesState.getProviderType(vmWareObject)).to.eq('VMware vCloud');
      expect(ProfilesState.getProviderType(unknownObject)).to.eq('Unknown');

      expect(ProfilesState.getProviderTypeImage(amazonObject).indexOf('amazon')).not.to.eq(-1);
      expect(ProfilesState.getProviderTypeImage(azureObject).indexOf('azure')).not.to.eq(-1);
      expect(ProfilesState.getProviderTypeImage(googleObject).indexOf('google')).not.to.eq(-1);
      expect(ProfilesState.getProviderTypeImage(openstackObject).indexOf('openstack')).not.to.eq(-1);
      expect(ProfilesState.getProviderTypeImage(vmWareObject).indexOf('vmware')).not.to.eq(-1);
      expect(ProfilesState.getProviderTypeImage(unknownObject).indexOf('unknown')).not.to.eq(-1);
    });

    it('should query the API for arbitration_profiles', function(done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse));

      ProfilesState.getProfiles().then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'arbitration_profiles',
          {
            expand: 'resources',
            attributes: ['name', 'ext_management_system', 'created_at', 'updated_at', 'description'],
          }
        );
        done();
      });
    });

    it('should query the arbitration_profiles API for profile details ', function(done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'get').returns(Promise.resolve(successResponse));

      ProfilesState.getProfileDetails('1').then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'arbitration_profiles',
          '1',
          {
            attributes: [
              'name',
              'description',
              'ext_management_system',
              'created_at',
              'updated_at',
              'authentication',
              'cloud_network',
              'cloud_subnet',
              'flavor',
              'availability_zone',
              'security_group',
            ]
          }
        );
        done();
      });
    });

    it('should query the API for providers', function(done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse));

      ProfilesState.getProviders().then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'providers',
          {
            expand: 'resources',
            attributes: [
              'id',
              'name',
              'type',
              'key_pairs',
              'availability_zones',
              'cloud_networks',
              'cloud_subnets',
              'flavors',
              'security_groups',
            ],
          }
        );
        done();
      });
    });

    it('should query the API for cloud_networks', function(done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse));

      ProfilesState.getCloudNetworks().then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'cloud_networks',
          {
            expand: 'resources',
            attributes: [
              'security_groups',
              'cloud_subnets',
            ],
          }
        );
        done();
      });
    });

    it('should make a notification success call when successfully adding a profile', function (done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
      ProfilesState.addProfile({name: 'newprofile'}).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'arbitration_profiles', null, {}, {name: 'newprofile'}
        );
        expect(notificationsSuccessSpy).to.have.been.called;
        expect(notificationsErrorSpy).not.to.have.been.called;
        done();
      });

    });

    it('should make a notification error call when an error occurs adding a profile', function (done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(errorResponse));

      ProfilesState.addProfile({name: 'errorprofile'}).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'arbitration_profiles', null, {}, {name: 'errorprofile'}
        );
        expect(notificationsSuccessSpy).not.to.have.been.called;
        expect(notificationsErrorSpy).to.have.been.called;
        done();
      });

    });

    it('should make a notification success call when successfully editing a profile', function (done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
      ProfilesState.editProfile({name: '1'}).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'arbitration_profiles', null, {}, {action: "edit", resources: [{name: '1'}]}
        );
        expect(notificationsSuccessSpy).to.have.been.called;
        expect(notificationsErrorSpy).not.to.have.been.called;
        done();
      });

    });

    it('should make a notification error call when an error occurs editing a profile', function (done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(errorResponse));
      ProfilesState.editProfile({name: '1'}).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'arbitration_profiles', null, {}, {action: "edit", resources: [{name: '1'}]}
        );
        expect(notificationsSuccessSpy).not.to.have.been.called;
        expect(notificationsErrorSpy).to.have.been.called;
        done();
      });

    });

    it('should make a notification success call when successfully deleting a profile', function (done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
      ProfilesState.deleteProfiles(['1', '2']).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'arbitration_profiles', null, {}, {action: "delete", resources: [{id: '1'}, {id: '2'}]}
        );
        expect(notificationsSuccessSpy).to.have.been.called;
        expect(notificationsErrorSpy).not.to.have.been.called;
        done();
      });

    });

    it('should a notification error call when an error occurs deleting a profile', function (done) {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(errorResponse));
      ProfilesState.deleteProfiles(['1', '2']).then(function(response) {
        expect(collectionsApiSpy).to.have.been.calledWith(
          'arbitration_profiles', null, {}, {action: "delete", resources: [{id: '1'}, {id: '2'}]}
        );
        expect(notificationsSuccessSpy).not.to.have.been.called;
        expect(notificationsErrorSpy).to.have.been.called;
        done();
      });

    });
  });
});


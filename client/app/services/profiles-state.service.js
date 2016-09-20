(function() {
  'use strict';

  angular.module('app.services')
      .factory('ProfilesState', ProfilesStateFactory);

  /** @ngInject */
  function ProfilesStateFactory(CollectionsApi, EventNotifications, sprintf, $q) {
    var profileState = {};

    profileState.providersInfo = [
      {
        keyword: 'amazon',
        title: 'Amazon EC2',
        image: 'assets/images/providers/vendor-amazon.svg',
      },
      {
        keyword: 'azure',
        title: 'Azure',
        image: 'assets/images/providers/vendor-azure.svg',
      },
      {
        keyword: 'google',
        title: 'Google Compute Engine',
        image: 'assets/images/providers/vendor-google.svg',
      },
      {
        keyword: 'openstack',
        title: 'OpenStack',
        image: 'assets/images/providers/vendor-openstack_infra.svg',
      },
      {
        keyword: 'vmware',
        title: 'VMware vCloud',
        image: 'assets/images/providers/vendor-vmware_cloud.svg',
      },
    ];

    profileState.getProviderType = function(typedObject) {
      var providerType = 'Unknown';

      if (typedObject) {
        var info = profileState.providersInfo.find(function(providerInfo) {
          return typedObject.type.toLowerCase().indexOf(providerInfo.keyword) >= 0;
        });
        if (info) {
          providerType = info.title;
        }
      }

      return providerType;
    };

    profileState.getProviderTypeImage = function(provider) {
      var providerImage = 'assets/images/providers/vendor-unknown.svg';

      if (provider) {
        var info = profileState.providersInfo.find(function(providerInfo) {
          return provider.type.toLowerCase().indexOf(providerInfo.keyword) >= 0;
        });
        if (info) {
          providerImage = info.image;
        }
      }

      return providerImage;
    };

    profileState.sort = {
      isAscending: true,
      currentField: {id: 'name', title: __('Name'), sortType: 'alpha'},
    };

    profileState.filters = [];

    profileState.setSort = function(currentField, isAscending) {
      profileState.sort.isAscending = isAscending;
      profileState.sort.currentField = currentField;
    };

    profileState.getSort = function() {
      return profileState.sort;
    };

    profileState.setFilters = function(filterArray) {
      profileState.filters = filterArray;
    };

    profileState.getFilters = function() {
      return profileState.filters;
    };

    profileState.getProfiles = function() {
      var options = {
        expand: 'resources',
        attributes: ['name', 'ext_management_system', 'created_at', 'updated_at', 'description'],
      };

      return CollectionsApi.query('arbitration_profiles', options);
    };

    profileState.getProfileDetails = function(profileId) {
      var options = {
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
          'security_group'
        ],
      };

      return CollectionsApi.get('arbitration_profiles', profileId, options);
    };

    profileState.getProviders = function() {
      var options = {
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
      };

      return CollectionsApi.query('providers', options);
    };

    profileState.getCloudNetworks = function() {
      var options = {
        expand: 'resources',
        attributes: [
          'security_groups',
          'cloud_subnets'
        ]
      };

      return CollectionsApi.query('cloud_networks', options);
    };

    profileState.addProfile = function(profileObj) {
      var deferred = $q.defer();

      CollectionsApi.post('arbitration_profiles', null, {}, profileObj).then(createSuccess, createFailure);

      function createSuccess(response) {
        EventNotifications.success(sprintf(__("Profile %s was created."), profileObj.name));
        deferred.resolve(response.results[0].id);
      }

      function createFailure() {
        EventNotifications.error(sprintf(__("There was an error creating profile %s."), profileObj.name));
        deferred.reject();
      }

      return deferred.promise;
    };

    profileState.editProfile = function(profile) {
      var deferred = $q.defer();

      var editSuccess = function(response) {
        EventNotifications.success(sprintf(__('Profile %s was successfully updated.'), profile.name));
        deferred.resolve(response.id);
      };

      var editFailure = function() {
        EventNotifications.error(sprintf(__('There was an error updating profile %s.'), profile.name));
        deferred.reject();
      };

      var editObj = {
        "action": "edit",
        "resources": [profile]
      };

      CollectionsApi.post('arbitration_profiles', null, {}, editObj).then(editSuccess, editFailure);

      return deferred.promise;
    };

    profileState.deleteProfiles = function(profileIds) {
      var deferred = $q.defer();

      var resources = [];
      for (var i = 0; i < profileIds.length; i++) {
        resources.push({id: profileIds[i]});
      }

      var profileObj = {
        action: "delete",
        resources: resources
      };

      CollectionsApi.post('arbitration_profiles', null, {}, profileObj).then(deleteSuccess, deleteFailure);

      function deleteSuccess() {
        EventNotifications.success(__('Profile(s) were succesfully deleted.'));
        deferred.resolve();
      }

      function deleteFailure() {
        EventNotifications.error(__('There was an error deleting the profile(s).'));
        deferred.reject();
      }

      return deferred.promise;
    };

    return profileState;
  }
})();

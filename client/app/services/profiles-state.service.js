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
        image: 'assets/images/providers/vendor-vmware-cloud.svg',
      },
    ];

    profileState.getProviderType = function(profile) {
      var providerType = 'Unknown';
      var info = profileState.providersInfo.find(function(providerInfo) {
        return profile.ext_management_system.type.toLowerCase().indexOf(providerInfo.keyword) >= 0;
      });
      if (info) {
        providerType = info.title;
      }

      return providerType;
    };

    profileState.getProviderTypeImage = function(profile) {
      var providerImage = 'assets/images/providers/vendor-unknown.svg';
      var info = profileState.providersInfo.find(function(providerInfo) {
        return profile.ext_management_system.type.toLowerCase().indexOf(providerInfo.keyword) >= 0;
      });
      if (info) {
        providerImage = info.image;
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
          'ext_management_system',
          'created_at',
          'updated_at',
          'key_pair',
          'authentication',
          'flavor',
          'availability_zone',
          'security_group',
          'cloud_subnet',
          'cloud_network'
        ],
      };

      return CollectionsApi.get('arbitration_profiles', profileId, options);
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

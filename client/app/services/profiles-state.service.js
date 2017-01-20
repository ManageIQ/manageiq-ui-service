/** @ngInject */
export function ProfilesStateFactory(CollectionsApi, EventNotifications, sprintf) {
  var profileState = {};

  var providerTypes = {
    amazon: 'Amazon EC2',
    azure: 'Azure',
    google: 'Google Compute Engine',
    openstack: 'OpenStack',
    vmware: 'VMware vCloud',
    unknown: 'Unknown',
  };
  var providerImages = {
    amazon: 'images/providers/vendor-amazon.svg',
    azure: 'images/providers/vendor-azure.svg',
    google: 'images/providers/vendor-google.svg',
    openstack: 'images/providers/vendor-openstack_infra.svg',
    vmware: 'images/providers/vendor-vmware_cloud.svg',
    unknown: 'images/providers/vendor-unknown.svg',
  };

  var providerTypeKeys = ['amazon', 'azure', 'google', 'openstack', 'vmware'];

  function getProviderKey(typedObject) {
    var key;

    if (typedObject) {
      key = providerTypeKeys.find(function(nextKey) {
        return typedObject.type.toLowerCase().indexOf(nextKey) >= 0;
      });
    }

    if (!key) {
      key = 'unknown';
    }

    return key;
  }

  profileState.getProviderTypes = function() {
    var returnTypes = [];

    angular.forEach(providerTypeKeys, function(key) {
      returnTypes.push(providerTypes[key]);
    });

    return returnTypes;
  };

  profileState.getProviderType = function(typedObject) {
    return  providerTypes[getProviderKey(typedObject)];
  };

  profileState.getProviderTypeImage = function(typedObject) {
    return  providerImages[getProviderKey(typedObject)];
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
        'security_group',
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
        'cloud_subnets',
      ],
    };

    return CollectionsApi.query('cloud_networks', options);
  };

  profileState.addProfile = function(profileObj) {
    function createSuccess(response) {
      EventNotifications.success(sprintf(__("Profile %s was created."), profileObj.name));
    }

    function createFailure() {
      EventNotifications.error(sprintf(__("There was an error creating profile %s."), profileObj.name));
    }

    return CollectionsApi.post('arbitration_profiles', null, {}, profileObj).then(createSuccess, createFailure);
  };

  profileState.editProfile = function(profile) {
    var editSuccess = function(response) {
      EventNotifications.success(sprintf(__('Profile %s was successfully updated.'), profile.name));
    };

    var editFailure = function() {
      EventNotifications.error(sprintf(__('There was an error updating profile %s.'), profile.name));
    };

    var editObj = {
      "action": "edit",
      "resources": [profile],
    };

    return CollectionsApi.post('arbitration_profiles', null, {}, editObj).then(editSuccess, editFailure);
  };

  profileState.deleteProfiles = function(profileIds) {
    var resources = [];
    for (var i = 0; i < profileIds.length; i++) {
      resources.push({id: profileIds[i]});
    }

    var profileObj = {
      action: "delete",
      resources: resources,
    };


    function deleteSuccess() {
      EventNotifications.success(__('Profile(s) were succesfully deleted.'));
    }

    function deleteFailure() {
      EventNotifications.error(__('There was an error deleting the profile(s).'));
    }

    return CollectionsApi.post('arbitration_profiles', null, {}, profileObj).then(deleteSuccess, deleteFailure);
  };

  return profileState;
}

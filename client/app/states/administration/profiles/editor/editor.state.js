(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'administration.profiles.editor': {
        url: '/edit/:profileId',
        templateUrl: 'app/states/administration/profiles/editor/editor.html',
        controller: StateController,
        controllerAs: 'vm',
        resolve: {
          profile: resolveProfile,
          providers: resolveProviders,
          cloudNetworks: resolveCloudNetworks,
        },
      },
    };
  }

  /** @ngInject */
  function resolveProfile($stateParams, ProfilesState) {
    if ($stateParams.profileId) {
      return ProfilesState.getProfileDetails($stateParams.profileId);
    } else {
      return null;
    }
  }

  /** @ngInject */
  function resolveProviders( ProfilesState) {
    return ProfilesState.getProviders();
  }

  /** @ngInject */
  function resolveCloudNetworks(ProfilesState) {
    return ProfilesState.getCloudNetworks();
  }

  /** @ngInject */
  function StateController(profile, providers, cloudNetworks, ProfilesState,
                           $state, $stateParams, SaveProfileModal, $scope, sprintf) {
    var vm = this;

    function setTitle() {
      if ($stateParams.profileId) {
        vm.title = sprintf(__("Edit Profile: %s"), profile.name);
      } else {
        vm.title = __("Add Profile");
      }
    }

    function checkDirty(profileObj, value) {
      if (angular.isUndefined(profileObj)) {
        vm.dirty = vm.dirty || (value && value.length > 0);
      } else {
        vm.dirty = vm.dirty || (value !== profileObj.name);
      }
    }

    function updateSelections() {
      vm.providerNames.splice(0, vm.providerNames.length);
      angular.forEach(providers.resources, function(provider) {
        var providerType = ProfilesState.getProviderType(provider);
        if (providerType === vm.editInfo.providerType) {
          vm.providerNames.push(provider.name);
        }
      });
      vm.providerNames.sort();
      vm.providerNameValid = vm.providerNames.indexOf(vm.editInfo.providerName) >= 0;

      vm.editInfo.provider = providers.resources.find(function(provider) {
        return (provider.name === vm.editInfo.providerName);
      });

      vm.keyPairs.splice(0, vm.keyPairs.length);
      vm.availabilityZones.splice(0, vm.availabilityZones.length);
      vm.flavors.splice(0, vm.flavors.length);
      vm.cloudNetworks.splice(0, vm.cloudNetworks.length);
      vm.cloudSubnets.splice(0, vm.cloudSubnets.length);
      vm.securityGroups.splice(0, vm.securityGroups.length);

      if (vm.editInfo.provider) {
        angular.forEach(vm.editInfo.provider.key_pairs, function(pair) {
          vm.keyPairs.push(pair.name);
        });
        vm.keyPairs.sort();

        angular.forEach(vm.editInfo.provider.availability_zones, function(zone) {
          vm.availabilityZones.push(zone.name);
        });
        vm.availabilityZones.sort();

        angular.forEach(vm.editInfo.provider.flavors, function(flavor) {
          vm.flavors.push(flavor.name);
        });
        vm.flavors.sort();

        angular.forEach(vm.editInfo.provider.cloud_networks, function(network) {
          vm.cloudNetworks.push(network.name);
        });
        vm.cloudNetworks.sort();

        vm.editInfo.cloudNetworkObj = cloudNetworks.resources.find(function(network) {
          return (network.name === vm.editInfo.cloudNetwork);
        });

        if (vm.editInfo.cloudNetworkObj) {
          angular.forEach(vm.editInfo.cloudNetworkObj.cloud_subnets, function(subnet) {
            vm.cloudSubnets.push(subnet.name);
          });
          vm.cloudSubnets.sort();

          angular.forEach(vm.editInfo.cloudNetworkObj.security_groups, function(group) {
            vm.securityGroups.push(group.name);
          });
          vm.securityGroups.sort();
        }
      }

      vm.dirty = !vm.profile;
      if (vm.profile) {
        checkDirty(vm.profile, vm.editInfo.name);
        vm.dirty = vm.dirty || (vm.profile.description !== vm.editInfo.description);
        checkDirty(vm.profile.ext_management_system, vm.editInfo.providerName);
        checkDirty(vm.profile.authentication, vm.editInfo.keyPair);
        checkDirty(vm.profile.availability_zone, vm.editInfo.availabilityZone);
        checkDirty(vm.profile.flavor, vm.editInfo.flavor);
        checkDirty(vm.profile.cloud_network, vm.editInfo.cloudNetwork);
        checkDirty(vm.profile.cloud_subnet, vm.editInfo.cloudSubnet);
        checkDirty(vm.profile.security_group, vm.editInfo.securityGroup);
      }

      vm.nameValid = vm.editInfo.name && vm.editInfo.name.length > 0;
      vm.descriptionValid = vm.editInfo.description && vm.editInfo.description.length > 0;
      vm.providerTypeValid = vm.editInfo.providerType && vm.editInfo.providerType.length > 0;
      vm.providerNameValid = vm.editInfo.providerName && vm.editInfo.providerName.length > 0;

      vm.formValid = vm.nameValid && vm.descriptionValid && vm.providerTypeValid && vm.providerNameValid;
    }

    function getIdForName(list, name) {
      if (list && list.length > 0) {
        var found = list.find(function(nextObject) {
          return (nextObject.name === name);
        });
        if (found) {
          return found.id;
        }
      }
    }

    function getProfileObject() {
      var profileObject = {};

      if (vm.profile) {
        profileObject.id = vm.profile.id;
      }

      profileObject.name = vm.editInfo.name;
      profileObject.description = vm.editInfo.description;

      if (vm.editInfo.provider) {
        profileObject.ems_id = vm.editInfo.provider.id;
        profileObject.authentication_id = getIdForName(vm.editInfo.provider.key_pairs, vm.editInfo.keyPair);
        profileObject.availability_zone_id = getIdForName(vm.editInfo.provider.availability_zones, vm.editInfo.availabilityZone);
        profileObject.flavor_id = getIdForName(vm.editInfo.provider.flavors, vm.editInfo.flavor);
      }

      if (vm.editInfo.cloudNetworkObj) {
        profileObject.cloud_network_id = vm.editInfo.cloudNetworkObj.id;
        profileObject.cloud_subnet_id = getIdForName(vm.editInfo.cloudNetworkObj.cloud_subnets, vm.editInfo.cloudSubnet);
        profileObject.security_group_id = getIdForName(vm.editInfo.cloudNetworkObj.security_groups, vm.editInfo.securityGroup);
      }

      return profileObject;
    }

    function saveProfile(toState, toParams) {
      function saveSuccess() {
        $state.go(toState, toParams);
      }

      function saveFailure() {
        $state.go(toState, toParams);
      }

      var profileObject = getProfileObject();
      if (vm.profile) {
        ProfilesState.editProfile(profileObject).then(saveSuccess, saveFailure);
      } else {
        ProfilesState.addProfile(profileObject).then(saveSuccess, saveFailure);
      }

      vm.dirty = false;
    }

    function handleSave() {
      if (vm.profile) {
        vm.saveProfile('administration.profiles.details', {profileId: vm.profile.id});
      } else {
        vm.saveProfile('administration.profiles');
      }
    }

    function handleCancel() {
      vm.dirty = false;
      if (vm.profile) {
        $state.go('administration.profiles.details', {profileId: vm.profile.id});
      } else {
        $state.go('administration.profiles');
      }
    }

    function setInitialVars(vm) {
      vm.profile = profile;
      vm.editInfo = {};

      if (vm.profile) {
        vm.editInfo.name = vm.profile.name;
        vm.editInfo.description = vm.profile.description;
        if (vm.profile.ext_management_system) {
          vm.editInfo.providerType = ProfilesState.getProviderType(vm.profile.ext_management_system);
          vm.editInfo.providerName = vm.profile.ext_management_system.name;
        }
        vm.editInfo.keyPair = vm.profile.authentication ? vm.profile.authentication.name : undefined;
        vm.editInfo.availabilityZone = vm.profile.availability_zone ? vm.profile.availability_zone.name : undefined;
        vm.editInfo.flavor = vm.profile.flavor ? vm.profile.flavor.name : undefined;
        vm.editInfo.cloudNetwork = vm.profile.cloud_network ? vm.profile.cloud_network.name : undefined;
        vm.editInfo.cloudSubnet = vm.profile.cloud_subnet ? vm.profile.cloud_subnet.name : undefined;
        vm.editInfo.securityGroup = vm.profile.security_group ? vm.profile.security_group.name : undefined;
      }

      vm.providerTypes = [];
      angular.forEach(providers.resources, function(provider) {
        var providerType = ProfilesState.getProviderType(provider);
        if (providerType !== 'Unknown') {
          var found = vm.providerTypes.find(function(nextType) {
            return nextType === providerType;
          });
          if (!found) {
            vm.providerTypes.push(providerType);
          }
        }
      });
      vm.providerTypes.sort();

      vm.providerNames = [];
      vm.keyPairs = [];
      vm.availabilityZones = [];
      vm.flavors = [];
      vm.cloudNetworks = [];
      vm.cloudSubnets = [];
      vm.securityGroups = [];

      vm.handleSave = handleSave;
      vm.handleCancel = handleCancel;
      vm.updateSelections = updateSelections;
      vm.saveProfile = saveProfile;

      setTitle();
      updateSelections();
    }

    setInitialVars(vm);

    activate();

    function activate() {
    }

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toState.name === 'login' || vm.saveModalShown) {
        return;
      }

      if (fromState.name === "administration.profiles.editor" && toState.name !== "administration.profiles.editor" && vm.dirty) {
        vm.saveModalShown = true;
        SaveProfileModal.showModal(save, doNotSave, cancel);
        event.preventDefault();
      }

      function save() {
        vm.saveModalShown = false;
        vm.saveProfile(toState, toParams);
      }

      function doNotSave() {
        vm.saveModalShown = false;
        vm.dirty = false;
        $state.go(toState, toParams);
      }

      function cancel() {
        vm.saveModalShown = false;
      }
    });
  }
})();

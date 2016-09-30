/* eslint camelcase: "off" */
(function() {
  'use strict';

  angular.module('app.components')
    .directive('profileEditor', function() {
      return {
        restrict: 'AE',
        templateUrl: 'app/components/profiles/profile-editor.html',
        scope: {
          profile: "=",
          providers: "=",
          cloudNetworks: "=",
          stateName: "@",
        },
        controller: ProfileEditorController,
        controllerAs: 'vm',
        bindToController: true,
      };
    });

  /** @ngInject */
  function ProfileEditorController(ProfilesState, $scope, $state, lodash, SaveProfileModal) {
    var vm = this;
    var listState = 'administration.profiles';
    var detailsState = listState + '.details';

    function checkDirty(profileObj, value) {
      if (angular.isUndefined(profileObj)) {
        vm.dirty = vm.dirty || (value && value.length > 0);
      } else {
        vm.dirty = vm.dirty || (value !== profileObj.name);
      }
    }

    function getNameArray(objectArray) {
      var nameArray = [];

      if (angular.isArray(objectArray)) {
        angular.forEach(objectArray, function (nextObject) {
          nameArray.push(nextObject.name);
        });
        nameArray.sort();
      }

      return nameArray;
    }

    function updateSelections() {
      vm.providerNames.splice(0, vm.providerNames.length);
      angular.forEach(vm.providers, function(provider) {
        var providerType = ProfilesState.getProviderType(provider);
        if (providerType === vm.editInfo.providerType) {
          vm.providerNames.push(provider.name);
        }
      });
      vm.providerNames.sort();
      vm.providerNameValid = vm.providerNames.indexOf(vm.editInfo.providerName) >= 0;

      vm.editInfo.provider = lodash.find(vm.providers, {name: vm.editInfo.providerName});

      vm.keyPairs.splice(0, vm.keyPairs.length);
      vm.availabilityZones.splice(0, vm.availabilityZones.length);
      vm.flavors.splice(0, vm.flavors.length);
      vm.cloudNetworkNames.splice(0, vm.cloudNetworkNames.length);
      vm.cloudSubnets.splice(0, vm.cloudSubnets.length);
      vm.securityGroups.splice(0, vm.securityGroups.length);

      if (vm.editInfo.provider) {
        vm.keyPairs = getNameArray(vm.editInfo.provider.key_pairs);
        vm.availabilityZones = getNameArray(vm.editInfo.provider.availability_zones);
        vm.flavors = getNameArray(vm.editInfo.provider.flavors);
        vm.cloudNetworkNames = getNameArray(vm.editInfo.provider.cloud_networks);

        vm.editInfo.cloudNetworkObj = lodash.find(vm.cloudNetworks, {name: vm.editInfo.cloudNetwork});
        if (vm.editInfo.cloudNetworkObj) {
          vm.cloudSubnets = getNameArray(vm.editInfo.cloudNetworkObj.cloud_subnets);
          vm.securityGroups = getNameArray(vm.editInfo.cloudNetworkObj.security_groups);
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
        var found = lodash.find(list, {name: name});
        if (found) {
          return found.id;
        } else {
          return '';
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

    function navigateAway(saveFirst, toState, toParams) {
      // If toState is not passed, go to the default state (details or list)
      if (!toState) {
        if (vm.profile) {
          toState = detailsState;
          toParams = {profileId: vm.profile.id};
        } else {
          toState = listState;
          toParams = undefined;
        }
      }

      function doNavigate() {
        $state.go(toState, toParams);
      }

      function saveSucces() {
        vm.dirty = false;
        doNavigate();
      }

      function saveFailure() {
        // Remain on the edit page if the save failed
      }

      if (saveFirst) {
        var profileObject = getProfileObject();
        if (vm.profile) {
          ProfilesState.editProfile(profileObject).then(saveSucces, saveFailure);
        } else {
          ProfilesState.addProfile(profileObject).then(saveSucces, saveFailure);
        }
      } else {
        doNavigate();
      }
    }

    function saveProfile(toState, toParams) {
      navigateAway(true, toState, toParams);
    }

    function handleSave() {
      saveProfile();
    }

    function handleCancel() {
      navigateAway(false);
    }

    function getName(namedObject) {
      var name;

      if (angular.isDefined(namedObject)) {
        name = namedObject.name;
      }

      return name;
    }

    function setInitialVars() {
      vm.editInfo = {};

      if (vm.profile) {
        vm.editInfo.name = vm.profile.name;
        vm.editInfo.description = vm.profile.description;
        if (vm.profile.ext_management_system) {
          vm.editInfo.providerType = ProfilesState.getProviderType(vm.profile.ext_management_system);
          vm.editInfo.providerName = vm.profile.ext_management_system.name;
        }
        vm.editInfo.keyPair = getName(vm.profile.authentication);
        vm.editInfo.availabilityZone = getName(vm.profile.availability_zone);
        vm.editInfo.flavor = getName(vm.profile.flavor);
        vm.editInfo.cloudNetwork = getName(vm.profile.cloud_network);
        vm.editInfo.cloudSubnet = getName(vm.profile.cloud_subnet);
        vm.editInfo.securityGroup = getName(vm.profile.security_group);
      }

      vm.providerTypes = [];

      // only add provider types that there are existing providers for
      angular.forEach(ProfilesState.getProviderTypes(), function(providerType) {
        var providerExists = lodash.find(vm.providers, function(provider) {
          return ProfilesState.getProviderType(provider) === providerType;
        });
        if (providerExists) {
          vm.providerTypes.push(providerType);
        }
      });

      vm.providerTypes.sort();

      vm.providerNames = [];
      vm.keyPairs = [];
      vm.availabilityZones = [];
      vm.flavors = [];
      vm.cloudNetworkNames = [];
      vm.cloudSubnets = [];
      vm.securityGroups = [];

      vm.handleSave = handleSave;
      vm.handleCancel = handleCancel;
      vm.updateSelections = updateSelections;
      vm.saveProfile = saveProfile;

      updateSelections();
    }

    setInitialVars();

    activate();

    function activate() {
    }

    var handleChangeState = $scope.$on('$stateChangeStart', function(event, toState, toParams) {
      if (toState.name === 'login' || vm.saveModalShown) {
        return;
      }

      if (toState.name !== vm.stateName && vm.dirty) {
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

    $scope.$on('destroy', handleChangeState);
  }
})();

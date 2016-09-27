/* eslint camelcase: "off" */
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
  function StateController(profile, providers, cloudNetworks, sprintf) {
    var vm = this;

    if (profile) {
      vm.title = sprintf(__("Edit Profile: %s"), profile.name);
    } else {
      vm.title = __("Add Profile");
    }

    vm.stateName = 'administration.profiles.editor';
    vm.profile = profile;
    vm.providers = providers.resources;
    vm.cloudNetworks = cloudNetworks.resources;
  }
})();

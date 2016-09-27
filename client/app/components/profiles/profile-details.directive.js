/* eslint camelcase: "off" */
(function() {
  'use strict';

  angular.module('app.components')
    .directive('profileDetails', function() {
      return {
        restrict: 'AE',
        templateUrl: 'app/components/profiles/profile-details.html',
        scope: {
          profile: "=",
        },
        controller: ProfileDetailsController,
        controllerAs: 'vm',
        bindToController: true,
      };
    });

  /** @ngInject */
  function ProfileDetailsController(ProfilesState, $state, sprintf) {
    var vm = this;

    function setTitle() {
      vm.title = sprintf(__("View Profile: %s"), vm.profile.name);
    }

    function editProfile() {
      $state.go('administration.profiles.editor', {profileId: vm.profile.id});
    }

    function setInitialVars() {
      vm.profile.providerType = ProfilesState.getProviderType(vm.profile.ext_management_system);
      vm.profile.providerImage = ProfilesState.getProviderTypeImage(vm.profile.ext_management_system);

      setTitle();
      vm.editProfile = editProfile;
    }

    setInitialVars();

    activate();

    function activate() {
    }
  }
})();

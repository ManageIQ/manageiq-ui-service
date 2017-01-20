/* eslint camelcase: "off" */

export const ProfileDetailsComponent = {
  templateUrl: 'app/components/profiles/profile-details.html',
  bindings: {
    profile: "=",
  },
  controller: ComponentController,
  controllerAs: 'vm',
};

/** @ngInject */
function ComponentController(ProfilesState, $state, sprintf) {
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

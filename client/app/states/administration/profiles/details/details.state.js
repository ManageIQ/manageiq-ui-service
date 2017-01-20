/** @ngInject */
export function ProfilesDetailsState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'administration.profiles.details': {
      url: '/:profileId',
      templateUrl: 'app/states/administration/profiles/details/details.html',
      controller: StateController,
      controllerAs: 'vm',
      title: N_('Profile Details'),
      resolve: {
        profile: resolveProfile,
      },
    },
  };
}

/** @ngInject */
function resolveProfile($stateParams, ProfilesState) {
  return ProfilesState.getProfileDetails($stateParams.profileId);
}

/** @ngInject */
function StateController(profile) {
  var vm = this;
  vm.profile = profile;

  if (profile) {
    vm.title = profile.name;
  }
}

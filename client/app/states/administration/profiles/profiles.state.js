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
      'administration.profiles': {
        parent: 'application',
        url: '/administration/profiles',
        templateUrl: 'app/states/administration/profiles/profiles.html',
        controller: ProfilesController,
        controllerAs: 'vm',
        title: N_('Profiles'),
        resolve: {
          arbitrationProfiles: resolveProfiles,
        },
      },
    };
  }

  /** @ngInject */
  function resolveProfiles(ProfilesState) {
    return ProfilesState.getProfiles();
  }

  /** @ngInject */
  function ProfilesController(arbitrationProfiles, ProfilesState, $scope, $rootScope, $timeout) {
    var vm = this;
    vm.title = __('Profiles');
    vm.arbitrationProfiles = arbitrationProfiles.resources;
    vm.refreshProfiles = refreshProfiles;

    function loadSuccess(arbitrationProfiles) {
      $timeout(function() {  // Done in a timeout since results are massaged outside of a $digest
        vm.arbitrationProfiles = arbitrationProfiles.resources;
      });
    }

    function loadFailure() {
    }

    function refreshProfiles() {
      ProfilesState.getProfiles().then(loadSuccess, loadFailure);
    }

    var onDestroy = $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      if (toState.name === 'administration.profiles') {
        vm.refreshProfiles();
      }
    });

    $scope.$on('$destroy', onDestroy);
  }
})();

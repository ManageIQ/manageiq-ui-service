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
  function ProfilesController(arbitrationProfiles, ProfilesState, $state, $timeout, $rootScope, $scope) {
    /* jshint validthis: true */
    var vm = this;
    vm.title = __('Profiles');
    vm.arbitrationProfiles = arbitrationProfiles.resources;
    vm.arbitrationProfilesList = [];
    vm.confirmDelete = false;

    var providerTypes = [];
    angular.forEach(ProfilesState.providersInfo, function(info) {
      providerTypes.push(info.title);
    });

    var updateProfileInfo = function(profile) {
      profile.providerType = ProfilesState.getProviderType(profile.ext_management_system);
      profile.providerImage = ProfilesState.getProviderTypeImage(profile.ext_management_system);
    };

    var updateProfilesInfo = function() {
      angular.forEach(vm.arbitrationProfiles, function(profile) {
        updateProfileInfo(profile);
      });

      vm.arbitrationProfiles.sort(compareProfiles);
    };

    var loadSuccess = function(arbitrationProfiles) {
      $timeout(function() {  // Done in a timeout since results are massaged outside of a $digest
        vm.arbitrationProfiles = arbitrationProfiles.resources;
        updateProfilesInfo();
        applyFilters(ProfilesState.getFilters());
      });
    };

    var loadFailure = function() {
    };

    var refreshProfiles = function() {
      ProfilesState.getProfiles().then(loadSuccess, loadFailure);
    };

    function sortChange(sortId, isAscending) {
      vm.arbitrationProfiles.sort(compareProfiles);

      /* Keep track of the current sorting state */
      ProfilesState.setSort(sortId, vm.toolbarConfig.sortConfig.isAscending);
    }

    function compareProfiles(item1, item2) {
      var compValue = 0;
      if (vm.toolbarConfig.sortConfig.currentField.id === 'name') {
        compValue = item1.name.localeCompare(item2.name);
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'last_modified') {
        compValue = new Date(item1.updated_at) - new Date(item2.updated_at);
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'provider_name') {
        compValue = item1.ext_management_system.name.localeCompare(item2.ext_management_system.name);
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'provider_type') {
        compValue = item1.ext_management_system.type.localeCompare(item2.ext_management_system.type);
      }

      if (compValue === 0) {
        compValue = item1.name.localeCompare(item2.name);
      }

      if (!vm.toolbarConfig.sortConfig.isAscending) {
        compValue = compValue * -1;
      }

      return compValue;
    }

    function filterChange(filters) {
      applyFilters(filters);
      vm.toolbarConfig.filterConfig.resultsCount = vm.arbitrationProfiles.length;
    }

    function applyFilters(filters) {
      vm.arbitrationProfilesList = [];
      if (filters && filters.length > 0) {
        angular.forEach(vm.arbitrationProfiles, filterChecker);
      } else {
        vm.arbitrationProfilesList = vm.arbitrationProfiles;
      }

      /* Keep track of the current filtering state */
      ProfilesState.setFilters(filters);

      /* Make sure sorting direction is maintained */
      sortChange(ProfilesState.getSort().currentField, ProfilesState.getSort().isAscending);

      function filterChecker(item) {
        if (matchesFilters(item, filters)) {
          vm.arbitrationProfilesList.push(item);
        }
      }
    }

    function matchesFilters(item, filters) {
      var matches = true;
      angular.forEach(filters, filterMatcher);

      function filterMatcher(filter) {
        if (!matchesFilter(item, filter)) {
          matches = false;

          return false;
        }
      }

      return matches;
    }

    function matchesFilter(item, filter) {
      var found = false;

      if (filter.id === 'name') {
        found = item.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      } else if (filter.id === 'provider_name') {
        found = item.ext_management_system.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      } else if (filter.id === 'provider_type') {
        found = item.providerType === filter.value;
      } else if (filter.id === 'description') {
        found = item.profile.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      }

      return found;
    }

    vm.addProfile = function() {
      $state.go('administration.profiles.editor');
    };

    vm.editProfile = function(profile) {
      $state.go('administration.profiles.editor', {profileId: profile.id});
    };

    vm.viewProfile = function(profile) {
      $state.go('administration.profiles.details', {profileId: profile.id});
    };

    vm.removeProfile = function(profile) {
      if (profile) {
        ProfilesState.deleteProfiles([profile.id]).then(removeSuccess, removeFailure);
      }

      function removeSuccess() {
        refreshProfiles();
      }

      function removeFailure() {
      }
    };
    vm.cancelRemoveProfile = function(profile) {
      vm.profileToDelete = undefined;
      vm.confirmDelete = false;
    };

    vm.handleView = function(action, profile) {
      vm.viewProfile(profile);
    };

    vm.handleEdit = function(action, profile) {
      vm.editProfile(profile);
    };

    vm.handleDelete = function(action, profile) {
      vm.profileToDelete = profile;
      vm.confirmDelete = true;
    };

    vm.menuActions = [
      {
        name: __('View'),
        title: __('View Profile'),
        actionFn: vm.handleView,
      },
      {
        name: __('Edit'),
        title: __('Edit Profile'),
        actionFn: vm.handleEdit,
      },
      {
        name: __('Delete'),
        title: __('Delete Profile'),
        actionFn: vm.handleDelete,
      },
    ];

    vm.toolbarConfig = {
      filterConfig: {
        fields: [
          {
            id: 'name',
            title: __('Name'),
            placeholder: __('Filter by Name'),
            filterType: 'text',
          },
          {
            id: 'provider_name',
            title: __('Provider Name'),
            placeholder: __('Filter by Provider Name'),
            filterType: 'text',
          },
          {
            id: 'provider_type',
            title: __('Provider Type'),
            placeholder: __('Filter by Provider Type'),
            filterType: 'select',
            filterValues: providerTypes,
          },
        ],
        resultsCount: vm.arbitrationProfilesList.length,
        appliedFilters: ProfilesState.getFilters(),
        onFilterChange: filterChange,
      },
      sortConfig: {
        fields: [
          {
            id: 'name',
            title: __('Name'),
            sortType: 'alpha',
          },
          {
            id: 'last_modified',
            title: __('Last Modified'),
            sortType: 'numeric',
          },
          {
            id: 'provider_name',
            title: __('Provider Name'),
            sortType: 'alpha',
          },
          {
            id: 'provider_type',
            title: __('Provider Type'),
            sortType: 'alpha',
          },
        ],
        onSortChange: sortChange,
        isAscending: ProfilesState.getSort().isAscending,
        currentField: ProfilesState.getSort().currentField,
      },
      actionsConfig: {
        primaryActions: [
          {
            name: __('Create'),
            title: __('Create a new Profile'),
            actionFn: vm.addProfile,
          },
        ],
      },
    };

    vm.listConfig = {
      showSelectBox: false,
      selectItems: false,
      onClick: vm.viewProfile,
    };

    updateProfilesInfo();
    applyFilters(ProfilesState.getFilters());

    var onDestroy = $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      if (toState.name === 'administration.profiles') {
        refreshProfiles();
      }
    });

    $scope.$on('$destroy', onDestroy);
  }
})();

/* eslint camelcase: "off" */
(function() {
  'use strict';

  angular.module('app.components')
    .directive('profilesList', function() {
      return {
        restrict: 'AE',
        templateUrl: "app/components/profiles/profiles-list.html",
        scope: {
          arbitrationProfiles: "=",
          refreshFn: '=',
        },
        controller: ProfilesListController,
        controllerAs: 'vm',
        bindToController: true,
      };
    });

  /** @ngInject */
  function ProfilesListController(ProfilesState, $state, $scope, lodash) {
    var vm = this;
    vm.title = __('Profiles');
    vm.arbitrationProfilesList = [];
    vm.confirmDelete = false;

    var providerTypes = ProfilesState.getProviderTypes();

    var updateProfileInfo = function(profile) {
      profile.providerType = ProfilesState.getProviderType(profile.ext_management_system);
      profile.providerImage = ProfilesState.getProviderTypeImage(profile.ext_management_system);
    };

    var updateProfilesInfo = function() {
      if (vm.arbitrationProfiles) {
        angular.forEach(vm.arbitrationProfiles, function(profile) {
          updateProfileInfo(profile);
        });

        vm.arbitrationProfiles.sort(compareProfiles);
        doFilter(ProfilesState.getFilters());
      }
    };

    var watcher = $scope.$watch(function() {
      return vm.arbitrationProfiles;
    }, function() {
      updateProfilesInfo();
    });

    $scope.$on('destroy', watcher);

    function sortChange(sortId, isAscending) {
      if (vm.arbitrationProfilesList) {
        vm.arbitrationProfilesList.sort(compareProfiles);

        /* Keep track of the current sorting state */
        ProfilesState.setSort(sortId, vm.toolbarConfig.sortConfig.isAscending);
      }
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
      doFilter(filters);
    }

    function doFilter(filters) {
      vm.arbitrationProfilesList = [];
      if (filters && filters.length > 0) {
        angular.forEach(vm.arbitrationProfiles, function(profile) {
          var doNotAdd = lodash.find(filters, function(filter) {
            if (!matchesFilter(profile, filter)) {
              return true;
            }
          });
          if (!doNotAdd) {
            vm.arbitrationProfilesList.push(profile);
          }
        });
      } else {
        vm.arbitrationProfilesList = vm.arbitrationProfiles;
      }

      vm.toolbarConfig.filterConfig.resultsCount = vm.arbitrationProfilesList.length;

      /* Keep track of the current filtering state */
      ProfilesState.setFilters(filters);

      /* Make sure sorting direction is maintained */
      sortChange(ProfilesState.getSort().currentField, ProfilesState.getSort().isAscending);
    }

    function nameCompare(object, value) {
      var match = false;

      if (angular.isString(object.name) && angular.isString(value)) {
        match = object.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      }

      return match;
    }

    function matchesFilter(item, filter) {
      var found = false;

      if (filter.id === 'name') {
        found = nameCompare(item, filter.value);
      } else if (filter.id === 'provider_name') {
        found = nameCompare(item.ext_management_system, filter.value);
      } else if (filter.id === 'provider_type') {
        found = item.providerType === filter.value;
      } else if (filter.id === 'description') {
        found = item.description.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
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

    vm.removeProfile = function() {
      if (vm.profileToDelete) {
        ProfilesState.deleteProfiles([vm.profileToDelete.id]).then(removeSuccess, removeFailure);
      }

      function removeSuccess() {
        vm.refreshFn();
      }

      function removeFailure() {
        vm.refreshFn();
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
          {
            id: 'description',
            title: __('Description'),
            placeholder: __('Filter by Description'),
            filterType: 'text',
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
  }
})();

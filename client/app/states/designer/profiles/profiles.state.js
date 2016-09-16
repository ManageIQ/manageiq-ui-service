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
      'designer.profiles': {
        parent: 'application',
        url: '/designer/profiles',
        templateUrl: 'app/states/designer/profiles/profiles.html',
        controller: ProfilesController,
        controllerAs: 'vm',
        title: N_('Profiles'),
        resolve: {
          designerProfiles: resolveProfiles,
        },
      },
    };
  }

  /** @ngInject */
  function resolveProfiles(ProfilesState) {
    return ProfilesState.getProfiles();
  }

  /** @ngInject */
  function ProfilesController(designerProfiles, ProfilesState, $state, $scope, $timeout) {
    /* jshint validthis: true */
    var vm = this;
    var providerTypes = ['Amazon EC2', 'Azure', 'Google Compute Engine', 'OpenStack', 'VMware vCloud'];
    vm.designerProfilesList = [];

    var updateProfileInfo = function(profile) {
      if (profile.ext_management_system && profile.ext_management_system.type) {
        if (profile.ext_management_system.type.toLowerCase().indexOf('amazon') >= 0) {
          profile.providerType = providerTypes[0];
          profile.providerImage = "assets/images/providers/vendor-amazon.svg";
        } else if (profile.ext_management_system.type.toLowerCase().indexOf('azure') >= 0) {
          profile.providerType = providerTypes[1];
          profile.providerImage = "assets/images/providers/vendor-azure.svg";
        } else if (profile.ext_management_system.type.toLowerCase().indexOf('google') >= 0) {
          profile.providerType = providerTypes[2];
          profile.providerImage = "assets/images/providers/vendor-google.svg";
        } else if (profile.ext_management_system.type.toLowerCase().indexOf('openstack') >= 0) {
          profile.providerType = providerTypes[3];
          profile.providerImage = "assets/images/providers/vendor-openstack_infra.svg";
        } else if (profile.ext_management_system.type.toLowerCase().indexOf('vmware') >= 0) {
          profile.providerType = providerTypes[4];
          profile.providerImage = "assets/images/providers/vendor-vmware-cloud.svg";
        } else {
          profile.providerImage = "assets/images/providers/vendor-unknown.svg";
        }
      } else {
        profile.providerImage = "assets/images/providers/vendor-unknown.svg";
      }
    };

    var updateProfilesInfo = function() {
      angular.forEach(vm.designerProfiles, function(profile) {
        updateProfileInfo(profile);
      });

      vm.designerProfiles.sort(compareProfiles);
    };

    var loadSuccess = function(designerProfiles) {
      $timeout(function() {  // Done in a timeout since results are massaged outside of a $digest
        vm.designerProfiles = designerProfiles.resources;
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
      vm.designerProfiles.sort(compareProfiles);

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
      vm.toolbarConfig.filterConfig.resultsCount = vm.designerProfiles.length;
    }

    function applyFilters(filters) {
      vm.designerProfilesList = [];
      if (filters && filters.length > 0) {
        angular.forEach(vm.designerProfiles, filterChecker);
      } else {
        vm.designerProfilesList = vm.designerProfiles;
      }

      /* Keep track of the current filtering state */
      ProfilesState.setFilters(filters);

      /* Make sure sorting direction is maintained */
      sortChange(ProfilesState.getSort().currentField, ProfilesState.getSort().isAscending);

      function filterChecker(item) {
        if (matchesFilters(item, filters)) {
          vm.designerProfilesList.push(item);
        }
      }
      console.dir(vm.designerProfilesList);
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

    vm.menuActions = [];

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
        resultsCount: vm.designerProfilesList.length,
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
      }
    };

    vm.listConfig = {
      showSelectBox: false,
      selectItems: false,
    };

    vm.title = __('Profiles');
    vm.designerProfiles = designerProfiles.resources;
    updateProfilesInfo();
    applyFilters(ProfilesState.getFilters());
  }
})();

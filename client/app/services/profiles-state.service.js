(function() {
  'use strict';

  angular.module('app.services')
      .factory('ProfilesState', ProfilesStateFactory);

  /** @ngInject */
  function ProfilesStateFactory(CollectionsApi) {
    var profileState = {};

    profileState.sort = {
      isAscending: true,
      currentField: {id: 'name', title: __('Name'), sortType: 'alpha'},
    };

    profileState.filters = [];

    profileState.setSort = function(currentField, isAscending) {
      profileState.sort.isAscending = isAscending;
      profileState.sort.currentField = currentField;
    };

    profileState.getSort = function() {
      return profileState.sort;
    };

    profileState.setFilters = function(filterArray) {
      profileState.filters = filterArray;
    };

    profileState.getFilters = function() {
      return profileState.filters;
    };

    profileState.getProfiles = function() {
      var options = {
        expand: 'resources',
        attributes: ['name', 'ext_management_system', 'created_at', 'updated_at', 'description'],
      };

      return CollectionsApi.query('arbitration_profiles', options);
    };

    return profileState;
  }
})();

/* eslint camelcase: "off" */
(function() {
  'use strict';

  angular.module('app.services')
    .factory('ServicesState', ServicesStateFactory);

  /** @ngInject */
  function ServicesStateFactory(ListConfiguration, CollectionsApi) {
    var service = {};

    ListConfiguration.setupListFunctions(service, { id: 'name', title: __('Name'), sortType: 'alpha' });

    // Returns minimal data for the services matching the current filters, useful for getting a filter count
    service.getServicesMinimal = function(filters) {
      var options = {
        filter: getQueryFilters(filters),
      };

      return CollectionsApi.query('services', options);
    };

    service.getServices = function(limit, offset, filters, sortField, sortAscending) {
      var options = {
        expand: 'resources',
        limit: limit,
        offset: String(offset),
        attributes: [
          'picture',
          'picture.image_href',
          'chargeback_report',
          'evm_owner.userid',
          'miq_group.description',
          'v_total_vms',
          'power_state',
          'power_states',
          'power_status',
          'all_service_children',
          'all_vms',
          'custom_actions',
          'service_resources',
          'tags'],
        filter: getQueryFilters(filters),
      };

      if (angular.isDefined(sortField)) {
        options.sort_by = service.getSort().currentField.id;
        options.sort_options = service.getSort().currentField.sortType === 'alpha' ? 'ignore_case' : '';
        options.sort_order = sortAscending ? 'asc' : 'desc';
      }

      return CollectionsApi.query('services', options);
    };

    function getQueryFilters(filters) {
      var queryFilters =  ['ancestry=null'];

      angular.forEach(filters, function(nextFilter) {
        if (nextFilter.id === 'name') {
          queryFilters.push("name='%" + nextFilter.value + "%'");
        } else {
          queryFilters.push(nextFilter.id + '=' + nextFilter.value );
        }
      });

      return queryFilters;
    }

    return service;
  }
})();

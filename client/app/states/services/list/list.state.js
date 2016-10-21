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
      'services.list': {
        url: '', // No url, this state is the index of projects
        templateUrl: 'app/states/services/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('Service List'),
        resolve: {
          services: resolveServices,
        },
      },
    };
  }

  /** @ngInject */
  function resolveServices(CollectionsApi) {
    var options = {
      expand: 'resources',
      attributes: ['picture', 'picture.image_href', 'evm_owner.name', 'v_total_vms'],
      filter: ['service_id=nil'],
    };

    return CollectionsApi.query('services', options);
  }

  /** @ngInject */
  function StateController($state, services, ServicesState, $filter, $rootScope, Language, ListView) {
    var vm = this;

    vm.services = [];

    if (angular.isDefined($rootScope.notifications) && $rootScope.notifications.data.length > 0) {
      $rootScope.notifications.data.splice(0, $rootScope.notifications.data.length);
    }

    angular.forEach(services.resources, function(item) {
      if (angular.isUndefined(item.service_id)) {
        vm.services.push(item);
      }
    });

    vm.servicesList = angular.copy(vm.services);

    vm.listConfig = {
      selectItems: false,
      showSelectBox: false,
      selectionMatchProp: 'service_status',
      onClick: handleClick,
    };

    var serviceFilterConfig = {
      fields: getServiceFilterFields(),
      resultsCount: vm.servicesList.length,
      appliedFilters: ServicesState.filterApplied ? ServicesState.getFilters() : [],
      onFilterChange: filterChange,
    };

    var serviceSortConfig = {
      fields: getServiceSortFields(),
      onSortChange: sortChange,
      isAscending: ServicesState.getSort().isAscending,
      currentField: ServicesState.getSort().currentField,
    };

    vm.toolbarConfig = {
      filterConfig: serviceFilterConfig,
      sortConfig: serviceSortConfig,
    };

    function getServiceFilterFields() {
      var retires = [__('Current'), __('Soon'), __('Retired')];

      return [
        ListView.createFilterField('name',       'Name',            'Filter by Name',            'text'),
        ListView.createFilterField('retirement', 'Retirement Date', 'Filter by Retirement Date', 'select', retires),
        ListView.createFilterField('vms',        'Number of VMs',   'Filter by VMs',             'text'),
        ListView.createFilterField('owner',      'Owner',           'Filter by Owner',           'text'),
        ListView.createFilterField('owner',      'Created',         'Filter by Created On',      'text'),
      ];
    }

    function getServiceSortFields() {
      return [
        ListView.createSortField('name',    'Name',            'alpha'),
        ListView.createSortField('retires', 'Retirement Date', 'numeric'),
        ListView.createSortField('vms',     'Number of VMs',   'numeric'),
        ListView.createSortField('owner',   'Owner',           'alpha'),
        ListView.createSortField('created', 'Created',         'numeric'),
      ];
    }

    if (ServicesState.filterApplied) {
      /* Apply the filtering to the data list */
      filterChange(ServicesState.getFilters());
      ServicesState.filterApplied = false;
    } else {
      vm.servicesList = ListView.applyFilters(ServicesState.getFilters(), vm.servicesList, vm.services, ServicesState, matchesFilter);

      /* Make sure sorting direction is maintained */
      sortChange(ServicesState.getSort().currentField, ServicesState.getSort().isAscending);
    }

    function handleClick(item, e) {
      $state.go('services.details', {serviceId: item.id});
    }

    function sortChange(sortId, isAscending) {
      vm.servicesList.sort(compareFn);

      /* Keep track of the current sorting state */
      ServicesState.setSort(sortId, vm.toolbarConfig.sortConfig.isAscending);
    }

    function compareFn(item1, item2) {
      var compValue = 0;
      if (vm.toolbarConfig.sortConfig.currentField.id === 'name') {
        compValue = item1.name.localeCompare(item2.name);
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'vms') {
        compValue = item1.v_total_vms - item2.v_total_vms;
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'owner') {
        if (angular.isUndefined(item1.evm_owner)
          && angular.isDefined(item2.evm_owner)) {
          compValue = 1;
        } else if (angular.isDefined(item1.evm_owner)
          && angular.isUndefined(item2.evm_owner)) {
          compValue = -1;
        } else if (angular.isUndefined(item1.evm_owner)
          && angular.isUndefined(item2.evm_owner)) {
          compValue = 0;
        } else {
          compValue = item1.evm_owner.name.localeCompare(item2.evm_owner.name);
        }
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'created') {
        compValue = new Date(item1.created_at) - new Date(item2.created_at);
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'retires') {
        compValue = getRetirementDate(item1.retires_on) - getRetirementDate(item2.retires_on);
      }

      if (!vm.toolbarConfig.sortConfig.isAscending) {
        compValue = compValue * -1;
      }

      return compValue;
    }

    /* Date 10 years into the future */
    var neverRetires = new Date();
    neverRetires.setDate(neverRetires.getYear() + 10);

    function getRetirementDate(value) {
      if (angular.isDefined(value)) {
        return new Date(value);
      } else {
        return neverRetires;
      }
    }

    function filterChange(filters) {
      vm.servicesList = ListView.applyFilters(filters, vm.servicesList, vm.services, ServicesState, matchesFilter);

      /* Make sure sorting direction is maintained */
      sortChange(ServicesState.getSort().currentField, ServicesState.getSort().isAscending);

      vm.toolbarConfig.filterConfig.resultsCount = vm.servicesList.length;
    }

    function matchesFilter(item, filter) {
      if (filter.id === 'name') {
        return item.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      } else if (filter.id === 'vms') {
        return String(item.v_total_vms).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      } else if (filter.id === 'owner' && angular.isDefined(item.evm_owner)) {
        return item.evm_owner.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      } else if (filter.id === 'retirement') {
        return checkRetirementDate(item, filter.value.toLowerCase());
      } else if (filter.id === 'created') {
        return $filter('date')(item.created_at).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      }

      return false;
    }

    function checkRetirementDate(item, filterValue) {
      var currentDate = new Date();

      if (filterValue === 'retired' && angular.isDefined(item.retires_on)) {
        return angular.isDefined(item.retired) && item.retired === true;
      } else if (filterValue === 'current') {
        return angular.isUndefined(item.retired) || item.retired === false;
      } else if (filterValue === 'soon' && angular.isDefined(item.retires_on)) {
        return new Date(item.retires_on) >= currentDate
          && new Date(item.retires_on) <= currentDate.setDate(currentDate.getDate() + 30);
      }

      return false;
    }

    Language.fixState(ServicesState, vm.toolbarConfig);
  }
})();

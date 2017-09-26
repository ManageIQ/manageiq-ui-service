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
      attributes: ['picture', 'picture.image_href', 'evm_owner.name', 'v_total_vms', 'chargeback_report'],
      filter: ['ancestry=null'],
    };

    return CollectionsApi.query('services', options);
  }

  /** @ngInject */
  function StateController($state, services, ServicesState, $filter, $rootScope, Language, ListView, Chargeback, PowerOperations) {
    var vm = this;

    vm.startService = PowerOperations.startService;
    vm.stopService = PowerOperations.stopService;
    vm.suspendService = PowerOperations.suspendService;
    vm.powerOperationUnknownState = PowerOperations.powerOperationUnknownState;
    vm.powerOperationInProgressState = PowerOperations.powerOperationInProgressState;
    vm.powerOperationOnState = PowerOperations.powerOperationOnState;
    vm.powerOperationOffState = PowerOperations.powerOperationOffState;
    vm.powerOperationSuspendState = PowerOperations.powerOperationSuspendState;
    vm.powerOperationTimeoutState = PowerOperations.powerOperationTimeoutState;
    vm.powerOperationStartTimeoutState = PowerOperations.powerOperationStartTimeoutState;
    vm.powerOperationStopTimeoutState = PowerOperations.powerOperationStopTimeoutState;
    vm.powerOperationSuspendTimeoutState = PowerOperations.powerOperationSuspendTimeoutState;

    vm.services = [];

    if (angular.isDefined($rootScope.notifications) && $rootScope.notifications.data.length > 0) {
      $rootScope.notifications.data.splice(0, $rootScope.notifications.data.length);
    }

    angular.forEach(services.resources, function(item) {
      if (angular.isUndefined(item.service_id)) {
        item.powerState = angular.isDefined(item.options.power_state) ? item.options.power_state : "";
        item.powerStatus = angular.isDefined(item.options.power_status) ? item.options.power_status : "";
        vm.services.push(item);
      }
    });

    vm.services.forEach(Chargeback.processReports);
    Chargeback.adjustRelativeCost(vm.services);

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
      filterConfig: {
        fields: [
          {
            id: 'name',
            title: __('Name'),
            placeholder: __('Filter by Name'),
            filterType: 'text',
          },
          {
            id: 'retirement',
            title: __('Retirement Date'),
            placeholder: __('Filter by Retirement Date'),
            filterType: 'select',
            filterValues: [__('Current'), __('Soon'), __('Retired')],
          },
          {
            id: 'vms',
            title: __('Number of VMs'),
            placeholder: __('Filter by VMs'),
            filterType: 'text',
          },
          {
            id: 'owner',
            title: __('Owner'),
            placeholder: __('Filter by Owner'),
            filterType: 'text',
          },
          {
            id: 'created',
            title: __('Created'),
            placeholder: __('Filter by Created On'),
            filterType: 'text',
          },
          {
            id: 'chargeback_relative_cost',
            title: __('Relative Cost'),
            placeholder: __('Filter by Relative Cost'),
            filterType: 'select',
            filterValues: ['$', '$$', '$$$', '$$$$'],
          },
        ],
        resultsCount: vm.servicesList.length,
        appliedFilters: ServicesState.filterApplied ? ServicesState.getFilters() : [],
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
            id: 'retires',
            title: __('Retirement Date'),
            sortType: 'numeric',
          },
          {
            id: 'vms',
            title: __('Number of VMs'),
            sortType: 'numeric',
          },
          {
            id: 'owner',
            title: __('Owner'),
            sortType: 'alpha',
          },
          {
            id: 'created',
            title: __('Created'),
            sortType: 'numeric',
          },
          {
            id: 'chargeback_relative_cost',
            title: __('Relative Cost'),
            sortType: 'alpha',
          },
        ],
        onSortChange: sortChange,
        isAscending: ServicesState.getSort().isAscending,
        currentField: ServicesState.getSort().currentField,
      },
    };

    vm.actionButtons = [
      {
        name: __('Start'),
        actionName: 'start',
        title: __('Start this service'),
        actionFn: startService,
        isDisabled: false,
      },
    ];

    vm.menuActions = [
      {
        name: __('Stop'),
        actionName: 'stop',
        title: __('Stop this service'),
        actionFn: stopService,
        isDisabled: false,
      },
      {
        name: __('Suspend'),
        actionName: 'suspend',
        title: __('Suspend this service'),
        actionFn: suspendService,
        isDisabled: false,
      },
    ];

    function getServiceFilterFields() {
      var retires = [__('Current'), __('Soon'), __('Retired')];

      return [
        ListView.createFilterField('name',       __('Name'),            __('Filter by Name'),            'text'),
        ListView.createFilterField('retirement', __('Retirement Date'), __('Filter by Retirement Date'), 'select', retires),
        ListView.createFilterField('vms',        __('Number of VMs'),   __('Filter by VMs'),             'text'),
        ListView.createFilterField('owner',      __('Owner'),           __('Filter by Owner'),           'text'),
        ListView.createFilterField('owner',      __('Created'),         __('Filter by Created On'),      'text'),
      ];
    }

    function getServiceSortFields() {
      return [
        ListView.createSortField('name',    __('Name'),            'alpha'),
        ListView.createSortField('retires', __('Retirement Date'), 'numeric'),
        ListView.createSortField('vms',     __('Number of VMs'),   'numeric'),
        ListView.createSortField('owner',   __('Owner'),           'alpha'),
        ListView.createSortField('created', __('Created'),         'numeric'),
      ];
    }

    if (ServicesState.filterApplied) {
      /* Apply the filtering to the data list */
      filterChange(ServicesState.getFilters());
      ServicesState.filterApplied = false;
    } else {
      applyFilters();
    }

    vm.enableButtonForItemFn = function(action, item) {
      return vm.powerOperationUnknownState(item)
        || vm.powerOperationOffState(item)
        || vm.powerOperationSuspendState(item)
        || vm.powerOperationTimeoutState(item);
    };

    vm.hideMenuForItemFn = function(item) {
      return vm.powerOperationUnknownState(item) || vm.powerOperationInProgressState(item);
    };

    vm.updateMenuActionForItemFn = function(action, item) {
      if (vm.powerOperationSuspendState(item) && action.actionName === "suspend") {
        action.isDisabled = true;
      } else if (vm.powerOperationOffState(item) && action.actionName === "stop") {
        action.isDisabled = true;
      } else {
        action.isDisabled = false;
      }
    };
    
    function startService(action, item) {
      vm.startService(item);
    }

    function stopService(action, item) {
      vm.stopService(item);
    }

    function suspendService(action, item) {
      vm.suspendService(item);
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
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'chargeback_relative_cost') {
        compValue = item1.chargeback_relative_cost.length - item2.chargeback_relative_cost.length;
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
      applyFilters(filters);
      vm.toolbarConfig.filterConfig.resultsCount = vm.servicesList.length;
    }

    function applyFilters(filters) {
      vm.servicesList = [];
      if (filters && filters.length > 0) {
        angular.forEach(vm.services, filterChecker);
      } else {
        vm.servicesList = vm.services;
      }

      /* Keep track of the current filtering state */
      ServicesState.setFilters(filters);

      /* Make sure sorting direction is maintained */
      sortChange(ServicesState.getSort().currentField, ServicesState.getSort().isAscending);

      function filterChecker(item) {
        if (matchesFilters(item, filters)) {
          vm.servicesList.push(item);
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
      } else if (filter.id === 'chargeback_relative_cost') {
        return item.chargeback_relative_cost === filter.value;
      }

      return false;
    }

    function checkRetirementDate(item, filterValue) {
      var currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
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

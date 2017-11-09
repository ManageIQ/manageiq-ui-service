(function() {
  'use strict';

  angular.module('app.states').run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'services.list': {
        url: '',
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
  function resolveServices(
    CollectionsApi, ServicesState, limit = 20, offset = 0) {
    var options = {
      expand: 'resources',
      attributes: [
        'picture',
        'picture.image_href',
        'evm_owner.name',
        'v_total_vms',
        'chargeback_report'],
      filter: ['ancestry=null'],
      limit: limit,
      offset: offset,
    };

    angular.forEach(ServicesState.getFilters(), function(item) {
      options.filter.push(item.id + '=' + item.value);
    });

    return CollectionsApi.query('services', options);
  }

  /** @ngInject */
  function StateController($state, services, ServicesState, $rootScope,
                           Language,
                           Chargeback, PowerOperations, CollectionsApi) {
    var vm = this;
    vm.offset = 0;
    vm.limit = 20;

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

    vm.listConfig = {
      selectItems: false,
      showSelectBox: false,
      selectionMatchProp: 'service_status',
      onClick: handleClick,
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
            id: 'retired',
            title: __('Retirement Status'),
            placeholder: __('Filter by Retirement Status'),
            filterType: 'select',
            filterValues: [__('true'), __('false'),],
          },
          {
            id: 'v_total_vms',
            title: __('Number of VMs'),
            placeholder: __('Filter by VMs'),
            filterType: 'text',
          },
          {
            id: 'evm_owner.name',
            title: __('Owner'),
            placeholder: __('Filter by Owner'),
            filterType: 'text',
          },
          {
            id: 'created_at',
            title: __('Created'),
            placeholder: __('Filter by Created On'),
            filterType: 'text',
          },
        ],
        resultsCount: 0,
        appliedFilters: ServicesState.filterApplied
          ? ServicesState.getFilters()
          : [],
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

    if (angular.isDefined($rootScope.notifications) &&
      $rootScope.notifications.data.length > 0) {
      $rootScope.notifications.data.splice(0,
        $rootScope.notifications.data.length);
    }

    processServices(services);

    function processServices(services) {
      vm.services = [];
      vm.servicesList = [];

      if (angular.isDefined(vm.toolbarConfig)) {
        vm.toolbarConfig.filterConfig.resultsCount = services.subquery_count;
      }

      angular.forEach(services.resources, function(item) {
        if (angular.isUndefined(item.service_id)) {
          item.powerState = angular.isDefined(item.options.power_state)
            ? item.options.power_state
            : '';
          item.powerStatus = angular.isDefined(item.options.power_status)
            ? item.options.power_status
            : '';
          vm.services.push(item);
        }
      });

      vm.services.forEach(Chargeback.processReports);
      Chargeback.adjustRelativeCost(vm.services);

      vm.servicesList = angular.copy(vm.services);
    }

    if (ServicesState.filterApplied) {
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
      return vm.powerOperationUnknownState(item) ||
        vm.powerOperationInProgressState(item);
    };

    vm.updateMenuActionForItemFn = function(action, item) {
      if (vm.powerOperationSuspendState(item) &&
        action.actionName === 'suspend') {
        action.isDisabled = true;
      } else if (vm.powerOperationOffState(item) &&
        action.actionName === 'stop') {
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
        compValue = getRetirementDate(item1.retires_on)
          - getRetirementDate(item2.retires_on);
      } else if (vm.toolbarConfig.sortConfig.currentField.id ===
        'chargeback_relative_cost') {
        compValue = item1.chargeback_relative_cost.length
          - item2.chargeback_relative_cost.length;
      }

      if (!vm.toolbarConfig.sortConfig.isAscending) {
        compValue = compValue * -1;
      }

      return compValue;
    }

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
      vm.toolbarConfig.filterConfig.resultsCount = services.subquery_count;
    }

    function applyFilters(filters) {
      ServicesState.setFilters(filters);
      resolveServices(CollectionsApi, ServicesState, vm.limit, vm.offset)
        .then(function(response) {
          processServices(response);
        });

      /* Make sure sorting direction is maintained */
      sortChange(ServicesState.getSort().currentField,
        ServicesState.getSort().isAscending);
    }

    vm.paginationUpdate = function(limit, offset) {
      vm.limit = limit;
      vm.offset = offset;
      resolveServices(CollectionsApi, ServicesState, limit, offset)
        .then(function(response) {
          processServices(response);
        });
    };

    Language.fixState(ServicesState, vm.toolbarConfig);
  }
})();

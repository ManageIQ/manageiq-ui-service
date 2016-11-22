(function() {
  'use strict';

  angular.module('app.components')
    .component('serviceExplorer', {
      controller: ComponentController,
      controllerAs: 'vm',
      bindings: {
        ancestorServiceCount: '=',
      },
      templateUrl: 'app/components/explorer/explorer.html',
    });

  /** @ngInject */
  function ComponentController($state, ServicesState, $filter, $rootScope, Language, ListView, Chargeback, pfViewUtils,
                               CollectionsApi, EventNotifications, sprintf, PowerOperations) {
    var vm = this;
    vm.$onInit = activate();
    function activate() {
      angular.extend(vm, {
        loading: false,
        services: [],
        serviceLimit: 25,
        servicesList: [],
        serviceLimitOptions: [5, 10, 20, 50, 100, 200, 500, 1000],
        serviceOffset: 0,
        serviceCount: vm.ancestorServiceCount,
        startService: PowerOperations.startService,
        stopService: PowerOperations.stopService,
        suspendService: PowerOperations.suspendService,
        powerOperationUnknownState: PowerOperations.powerOperationUnknownState,
        powerOperationInProgressState: PowerOperations.powerOperationInProgressState,
        powerOperationOnState: PowerOperations.powerOperationOnState,
        powerOperationOffState: PowerOperations.powerOperationOffState,
        powerOperationSuspendState: PowerOperations.powerOperationSuspendState,
        powerOperationTimeoutState: PowerOperations.powerOperationTimeoutState,
        powerOperationStartTimeoutState: PowerOperations.powerOperationStartTimeoutState,
        powerOperationStopTimeoutState: PowerOperations.powerOperationStopTimeoutState,
        powerOperationSuspendTimeoutState: PowerOperations.powerOperationSuspendTimeoutState,
        // Functions
        updateLimit: updateLimit,
        viewService: viewService,
        resolveServices: resolveServices,
      });
      vm.resolveServices(vm.serviceLimit, vm.serviceOffset);
    }

    if (angular.isDefined($rootScope.notifications) && $rootScope.notifications.data.length > 0) {
      $rootScope.notifications.data.splice(0, $rootScope.notifications.data.length);
    }

    vm.cardConfig = {
      selectItems: false,
      multiSelect: true,
      dblClick: false,
      selectionMatchProp: 'name',
      selectedItems: [],
      showSelectBox: true,
      onClick: vm.viewService,
    };

    vm.listConfig = {
      selectItems: false,
      showSelectBox: true,
      useExpandingRows: true,
      selectionMatchProp: 'service_status',
      selectedItems: [],
      onClick: vm.viewService,
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

    var viewSelected = function(viewId) {
      vm.viewType = viewId;
    };


    var viewsConfig = {
      views: [pfViewUtils.getListView(), pfViewUtils.getCardView()],
      onViewSelect: viewSelected,
    };

    viewsConfig.currentView = viewsConfig.views[0].id;

    vm.viewType = viewsConfig.currentView;

    vm.headerConfig = {
      sortConfig: serviceSortConfig,
      viewsConfig: viewsConfig,
      filterConfig: serviceFilterConfig,
    };


    vm.footerConfig = {
      actionsConfig: {
        actionsInclude: true,
      },
    };

    vm.menuActions = [
      {
        name: __('Stop'),
        actionName: 'stop',
        title: __('Stop this service'),
        actionFn: stopService,
        isDisabled: false,
      }, {
        name: __('Start'),
        actionName: 'Start',
        title: __('Start this service'),
        actionFn: startService,
        isDisabled: false,
      }, {
        name: __('Suspend'),
        actionName: 'suspend',
        title: __('Suspend this service'),
        actionFn: suspendService,
        isDisabled: false,
      },
    ];

    if (ServicesState.filterApplied) {
      /* Apply the filtering to the data list */
      filterChange(ServicesState.getFilters());
      ServicesState.filterApplied = false;
    } else {
      vm.servicesList = ListView.applyFilters(ServicesState.getFilters(), vm.servicesList, vm.services, ServicesState, matchesFilter);

      /* Make sure sorting direction is maintained */
      sortChange(ServicesState.getSort().currentField, ServicesState.getSort().isAscending);
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
      } else {
        vm.powerOperationOffState(item) && action.actionName === "stop" ? action.isDisabled = true : action.isDisabled = false;
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


    function sortChange(sortId, isAscending) {
      vm.servicesList.sort(compareFn);

      /* Keep track of the current sorting state */
      ServicesState.setSort(sortId, vm.headerConfig.sortConfig.isAscending);
    }

    function updateLimit(limit) {
      vm.serviceLimit = limit;
      vm.resolveServices(limit, vm.serviceOffset);
    }

    function viewService(item, e) {
      $state.go('services.details', {serviceId: item.id});
    }

    // Private

    function filterChange(filters) {
      vm.servicesList = ListView.applyFilters(filters, vm.servicesList, vm.services, ServicesState, matchesFilter);

      /* Make sure sorting direction is maintained */
      sortChange(ServicesState.getSort().currentField, ServicesState.getSort().isAscending);

      vm.headerConfig.filterConfig.resultsCount = vm.servicesList.length;
    }

    function getServiceFilterFields() {
      var retires = [__('Current'), __('Soon'), __('Retired')];
      var dollars = ['$', '$$', '$$$', '$$$$'];

      return [
        ListView.createFilterField('chargeback_relative_cost', __('Relative Cost'), __('Filter by Relative Cost'), 'select', dollars),
        ListView.createFilterField('name', __('Name'), __('Filter by Name'), 'text'),
        ListView.createFilterField('owner', __('Created'), __('Filter by Created On'), 'text'),
        ListView.createFilterField('retirement', __('Retirement Date'), __('Filter by Retirement Date'), 'select', retires),
        ListView.createFilterField('region_number', __('Region'), __('Filter by Region'), 'text'),
        ListView.createFilterField('vms', __('Number of VMs'), __('Filter by VMs'), 'text'),
      ];
    }

    function matchesFilter(item, filter) {
      if (filter.id === 'name') {
        return item.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      } else if (filter.id === 'vms') {
        return String(item.v_total_vms).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      } else if (filter.id === 'region_number') {
        return String(item.region_number).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      } else if (filter.id === 'retirement') {
        return checkRetirementDate(item, filter.value.toLowerCase());
      } else if (filter.id === 'created') {
        return $filter('date')(item.created_at).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      } else if (filter.id === 'chargeback_relative_cost') {
        return item.chargeback_relative_cost === filter.value;
      }

      return false;
    }

    function getServiceSortFields() {
      return [
        ListView.createSortField('chargeback_relative_cost', __('Relative Cost'), 'alpha'),
        ListView.createSortField('created', __('Created'), 'numeric'),
        ListView.createSortField('name', __('Name'), 'alpha'),
        ListView.createSortField('retires', __('Retirement Date'), 'numeric'),
        ListView.createSortField('region_number', __('Region'), 'numeric'),
        ListView.createSortField('aggregate_all_vm_cpus', __('Total CPUs'), 'numeric'),
        ListView.createSortField('aggregate_all_vm_memory', __('Total Memory'), 'numeric'),
        ListView.createSortField('aggregate_all_vm_disk_count', __('Total VM Disk Count'), 'numeric'),
        ListView.createSortField('aggregate_all_vm_disk_space_allocated', __('VM Disk Space Allocated '), 'numeric'),
        ListView.createSortField('aggregate_all_vm_disk_space_used', __('Disk Space Used'), 'numeric'),
        ListView.createSortField('aggregate_all_vm_memory_on_disk', __('VM Memory on Disk'), 'numeric'),

      ];
    }

    function compareFn(item1, item2) {
      var compValue = 0;
      switch (vm.headerConfig.sortConfig.currentField.id) {
        case 'name':
          compValue = item1.name.localeCompare(item2.name);
          break;
        case 'vms':
          compValue = item1.v_total_vms - item2.v_total_vms;
          break;
        case 'region':
          compValue = item1.region_number - item2.region_number;
          break;
        case 'created':
          compValue = new Date(item1.created_at) - new Date(item2.created_at);
          break;
        case 'retires':
          compValue = getRetirementDate(item1.retires_on) - getRetirementDate(item2.retires_on);
          break;
        case 'chargeback_relative_cost':
          compValue = item1.chargeback_relative_cost.length - item2.chargeback_relative_cost.length;
          break;
        case 'aggregate_all_vm_cpus':
          compValue = item1.aggregate_all_vm_cpus - item2.aggregate_all_vm_cpus;
          break;
        case 'aggregate_all_vm_memory':
          compValue = item1.aggregate_all_vm_memory - item2.aggregate_all_vm_memory;
          break;
        case 'aggregate_all_vm_disk_count':
          compValue = item1.aggregate_all_vm_disk_count - item2.aggregate_all_vm_disk_count;
          break;
        case 'aggregate_all_vm_disk_space_allocated':
          compValue = item1.aggregate_all_vm_disk_space_allocated - item2.aggregate_all_vm_disk_space_allocated;
          break;
        case 'aggregate_all_vm_disk_space_used':
          compValue = item1.aggregate_all_vm_disk_space_used - item2.aggregate_all_vm_disk_space_used;
          break;
        case 'aggregate_all_vm_memory_on_disk':
          compValue = item1.aggregate_all_vm_memory_on_disk - item2.aggregate_all_vm_memory_on_disk;
          break;
      }

      if (!vm.headerConfig.sortConfig.isAscending) {
        compValue = compValue * -1;
      }

      return compValue;
    }

    function getRetirementDate(value) {
      /* Date 10 years into the future */
      var neverRetires = new Date();
      neverRetires.setDate(neverRetires.getYear() + 10);

      if (angular.isDefined(value)) {
        return new Date(value);
      } else {
        return neverRetires;
      }
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

    function resolveServices(limit, offset) {
      var options = {
        expand: 'resources',
        limit: limit,
        offset: String(offset),
        attributes: ['picture', 'picture.image_href', 'chargeback_report',
          'v_total_vms', 'aggregate_all_vm_cpus', 'aggregate_all_vm_memory', 'aggregate_all_vm_disk_count', 'aggregate_all_vm_disk_space_allocated',
          'aggregate_all_vm_disk_space_used', 'aggregate_all_vm_memory_on_disk', 'region_number', 'region_description'],
        filter: ['ancestry=null'],
      };
      vm.loading = true;

      CollectionsApi.query('services', options).then(querySuccess, queryFailure);
    }

    function querySuccess(result) {
      vm.loading = false;
      vm.services = [];

      angular.forEach(result.resources, function(item) {
        if (angular.isUndefined(item.service_id)) {
          item.powerState = angular.isDefined(item.options.power_state) ? item.options.power_state : "";
          item.powerStatus = angular.isDefined(item.options.power_status) ? item.options.power_status : "";
          vm.services.push(item);
        }
      });
      vm.services.forEach(Chargeback.processReports);
      Chargeback.adjustRelativeCost(vm.services);
      vm.servicesList = angular.copy(vm.services);
      vm.headerConfig.filterConfig.resultsCount = vm.servicesList.length;
    }

    function queryFailure(error) {
      vm.loading = false;
      EventNotifications.error(__('There was an error loading the services.'));
    }

    Language.fixState(ServicesState, vm.headerConfig);
  }
})();

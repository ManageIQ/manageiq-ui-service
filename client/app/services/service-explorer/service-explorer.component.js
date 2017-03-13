/* eslint camelcase: "off" */
import '../../../assets/sass/_explorer.sass';
import templateUrl from './service-explorer.html';

export const ServiceExplorerComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  templateUrl,
};

/** @ngInject */
function ComponentController($state, ServicesState, Language, ListView, Chargeback, TaggingService, TagEditorModal,
                             EventNotifications, ModalService, PowerOperations, lodash, Polling) {
  var vm = this;
  vm.$onInit = activate();
  vm.$onDestroy = function() {
    Polling.stop('serviceListPolling');
  };
  function activate() {
    if ($state.params.filter) {
      ServicesState.services.setFilters($state.params.filter);
      ServicesState.services.filterApplied = true;
    } else {
      ServicesState.services.setFilters([]);
      ServicesState.services.filterApplied = false;
    }

    angular.extend(vm, {
      loading: false,
      title: __('Services'),
      services: [],
      limit: 20,
      filterCount: 0,
      servicesList: [],
      selectedItemsList: [],
      limitOptions: [5, 10, 20, 50, 100, 200, 500, 1000],
      selectedItemsListCount: 0,
      // Functions
      resolveServices: resolveServices,
      viewSelected: viewSelected,
      actionEnabled: actionEnabled,
      updateMenuActionForItemFn: updateMenuActionForItemFn,
      listActionDisable: listActionDisable,
      isAnsibleService: isAnsibleService,
      viewService: viewService,
      startService: startService,
      stopService: stopService,
      suspendService: suspendService,
      paginationUpdate: paginationUpdate,
      // Config setup
      viewType: 'listView',
      cardConfig: getCardConfig(),
      listConfig: getListConfig(),
      listActions: getListActions(),
      headerConfig: getHeaderConfig(),
      menuActions: getMenuActions(),
      serviceChildrenListConfig: createServiceChildrenListConfig(),
      pollingInterval: 10000,
    });
    vm.offset = 0;

    Language.fixState(ServicesState.services, vm.headerConfig);

    resolveServices(vm.limit, 0);
    Polling.start('serviceListPolling', pollUpdateServicesList, vm.pollingInterval);
  }

  function getCardConfig() {
    return {
      multiSelect: true,
      selectionMatchProp: 'id',
      onCheckBoxChange: vm.handleSelectionChange,
    };
  }

  function getListConfig() {
    return {
      useExpandingRows: true,
      selectionMatchProp: 'id',
      onCheckBoxChange: handleSelectionChange,
      onClick: expandRow,
    };
  }

  function handleSelectionChange() {
    vm.selectedItemsList = vm.servicesList.filter(function(service) {
      return service.selected;
    });
    vm.selectedItemsListCount = vm.selectedItemsList.length;
  }

  function isAnsibleService(service) {
    var compareValue = angular.isDefined(service.type) ? service.type : service.name;

    return compareValue.toLowerCase().indexOf('ansible') !== -1;
  }

  function getListActions() {
    var configActions, lifeCycleActions, policyActions;
    var listActions = [];

    lifeCycleActions = ServicesState.getLifeCycleCustomDropdown(setServiceRetirement, retireService);
    if (lifeCycleActions) {
      listActions.push(lifeCycleActions);
    }

    policyActions = ServicesState.getPolicyCustomDropdown(editTags);
    if (policyActions) {
      listActions.push(policyActions);
    }

    configActions = ServicesState.getConfigurationCustomDropdown(editService, removeServices, setOwnership);
    if (configActions) {
      listActions.push(configActions);
    }

    return listActions;
  }

  function actionEnabled(actionName, item) {
    var enabled = true;
    switch (actionName) {
      case "start":
        enabled = PowerOperations.allowStartService(item);
        break;
      case "stop":
        enabled = PowerOperations.allowStopService(item);
        break;
      case "suspend":
        enabled = PowerOperations.allowSuspendService(item);
        break;
    }

    return enabled;
  }

  function updateMenuActionForItemFn(action, item) {
    switch (action.actionName) {
      case "start":
        action.isVisible = !isAnsibleService(item);
        break;
      case "stop":
        action.isVisible = !isAnsibleService(item);
        break;
      case "suspend":
        action.isVisible = !isAnsibleService(item);
        break;
      case "powerOperationsDivider":
        action.isVisible = !isAnsibleService(item);
        break;
    }
    action.isDisabled = !actionEnabled(action.actionName, item);
  }

  function startService(_action, item) {
    PowerOperations.startService(item);
  }

  function stopService(_action, item) {
    PowerOperations.stopService(item);
  }

  function suspendService(_action, item) {
    PowerOperations.suspendService(item);
  }

  function pollUpdateServicesList() {
    resolveServices(vm.limit, vm.offset, true);
  }

  function viewSelected(viewId) {
    vm.viewType = viewId;
  }


  function getHeaderConfig() {
    var serviceFilterConfig = {
      fields: getServiceFilterFields(),
      resultsCount: 0,
      appliedFilters: ServicesState.services.filterApplied ? ServicesState.services.getFilters() : [],
      onFilterChange: filterChange,
    };

    var serviceSortConfig = {
      fields: getServiceSortFields(),
      onSortChange: sortChange,
      isAscending: ServicesState.services.getSort().isAscending,
      currentField: ServicesState.services.getSort().currentField,
    };

    return {
      sortConfig: serviceSortConfig,
      filterConfig: serviceFilterConfig,
      actionsConfig: {
        actionsInclude: true,
      },
    };
  }

  function createServiceChildrenListConfig() {
    return {
      showSelectBox: false,
    };
  }

  function getMenuActions() {
    return [
      {
        name: __('Edit'),
        actionName: 'edit',
        title: __('Edit Service'),
        actionFn: editServiceItem,
        isDisabled: false,
      },
      {
        name: __('Edit Tags'),
        actionName: 'editTags',
        title: __('Edit Tags'),
        actionFn: editTagsItem,
        isDisabled: false,
      },
      {
        name: __('Set Ownership'),
        actionName: 'ownership',
        title: __('Set Ownership'),
        actionFn: setOwnershipItem,
        isDisabled: false,
      },
      {
        name: __('Retire'),
        actionName: 'retireService',
        title: __('Retire Service'),
        actionFn: retireServiceItem,
        isDisabled: false,
      },
      {
        name: __('Set Retirement'),
        actionName: 'setServiceRetirement',
        title: __('Set Retirement Dates'),
        actionFn: setServiceRetirementItem,
        isDisabled: false,
      },
      {
        name: __('Remove'),
        actionName: 'remove',
        title: __('Remove Service'),
        actionFn: removeServicesItem,
        isDisabled: false,
      },
      {
        actionName: 'powerOperationsDivider',
        isSeparator: true,
      },
      {
        name: __('Start'),
        actionName: 'start',
        title: __('Start this service'),
        actionFn: startService,
        isDisabled: false,
      }, {
        name: __('Stop'),
        actionName: 'stop',
        title: __('Stop this service'),
        actionFn: stopService,
        isDisabled: false,
      }, {
        name: __('Suspend'),
        actionName: 'suspend',
        title: __('Suspend this service'),
        actionFn: suspendService,
        isDisabled: false,
      },
    ];
  }

  function sortChange(sortId, isAscending) {
    ServicesState.services.setSort(sortId, isAscending);
    resolveServices(vm.limit, 0);
  }

  function expandRow(item) {
    if (!item.disableRowExpansion) {
      item.isExpanded = !item.isExpanded;
    }
  }

  function viewService(item, ev) {
    $state.go('services.details', {serviceId: item.id});
    ev.stopImmediatePropagation();
  }

  // Private
  function filterChange(filters) {
    ServicesState.services.setFilters(filters);
    resolveServices(vm.limit, 0);
  }

  function getServiceFilterFields() {
    return [
      ListView.createFilterField('name', __('Name'), __('Filter by Name'), 'text'),
      ListView.createFilterField('description', __('Description'), __('Filter by Description'), 'text'),
      ListView.createFilterField('v_total_vms', __('Number of VMs'), __('Filter by VMs'), 'numeric'),

      // TODO: find a way to filter on virtual attributes
      // ListView.createFilterField('chargeback_relative_cost', __('Relative Cost'), __('Filter by Relative Cost'), 'select', dollars),
      // TODO:  find a good way to filter on date other than string
      // ListView.createFilterField('owner', __('Created'), __('Filter by Created On'), 'text'),
    ];
  }

  function getServiceSortFields() {
    return [
      ListView.createSortField('created_at', __('Created'), 'numeric'),
      ListView.createSortField('name', __('Name'), 'alpha'),
      ListView.createSortField('retires_on', __('Retirement Date'), 'numeric'),

      // TODO: Find a way to sort by charback cost
      // ListView.createSortField('chargeback_report.used_cost_sum', __('Relative Cost'), 'alpha'),
    ];
  }

  function getFilterCount() {
    ServicesState.getServicesMinimal(ServicesState.services.getFilters())
      .then(querySuccess, queryFailure);

    function querySuccess(result) {
      vm.filterCount = result.subcount;
    }

    function queryFailure(_error) {
      vm.loading = false;
      EventNotifications.error(__('There was an error loading the services.'));
    }
  }

  function resolveServices(limit, offset, refresh) {
    if (!refresh) {
      vm.loading = true;
    } else {
      vm.loading = false;
    }
    vm.offset = offset;

    ServicesState.getServices(
      limit,
      offset,
      ServicesState.services.getFilters(),
      ServicesState.services.getSort().currentField,
      ServicesState.services.getSort().isAscending).then(querySuccess, queryFailure);

    function querySuccess(result) {
      vm.loading = false;
      vm.services = [];
      var existingServices = (angular.isDefined(vm.servicesList) && refresh ? angular.copy(vm.servicesList) : []);
      vm.selectedItemsList = [];

      angular.forEach(result.resources, function(item) {
        if (angular.isUndefined(item.service_id)) {
          item.disableRowExpansion = item.all_service_children.length < 1;
          item.power_state = PowerOperations.getPowerState(item);
          angular.forEach(item.all_service_children, function(childService) {
            childService.power_state = PowerOperations.getPowerState(item);
          });

          if (refresh) {
            for (var i = 0; i < existingServices.length; i++) {
              var currentService = existingServices[i];
              if (currentService.id === item.id) {
                item.selected = (angular.isDefined(currentService.selected) ? currentService.selected : false);
                item.isExpanded = (angular.isDefined(currentService.isExpanded) ? currentService.isExpanded : false);
                if (item.selected) {
                  vm.selectedItemsList.push(item);
                }
                existingServices.splice(i, 1);
                break;
              }
            }
          }
          vm.services.push(item);
        }
      });
      vm.services.forEach(Chargeback.processReports);
      Chargeback.adjustRelativeCost(vm.services);
      vm.servicesList = angular.copy(vm.services);
      vm.headerConfig.filterConfig.resultsCount = vm.filterCount;

      getFilterCount();
    }

    function queryFailure(_error) {
      vm.loading = false;
      EventNotifications.error(__('There was an error loading the services.'));
    }
  }

  function listActionDisable(config, items) {
    config.isDisabled = items.length <= 0;
    if (config.actionName === "configuration") {
      if (items.length > 1) {
        lodash.forEach(config.actions, disableItems);
      } else {
        lodash.forEach(config.actions, enableItems);
      }
    }

    function disableItems(item) {
      if (item.actionName === "edit") {
        item.isDisabled = true;
      }
    }

    function enableItems(item) {
      if (item.actionName === "edit") {
        item.isDisabled = false;
      }
    }
  }

  function doEditService(service) {
    var modalOptions = {
      component: 'editServiceModal',
      resolve: {
        service: function() {
          return service;
        },
      },
    };
    ModalService.open(modalOptions);
  }

  function doEditTags(services) {
    var extractSharedTagsFromSelectedServices
      = lodash.partial(TaggingService.findSharedTags, services);

    var launchTagEditorForSelectedServices
      = lodash.partial(TagEditorModal.showModal, services);

    return TaggingService.queryAvailableTags()
      .then(extractSharedTagsFromSelectedServices)
      .then(launchTagEditorForSelectedServices);
  }

  function doRemoveServices(services) {
    var modalOptions = {
      component: 'retireRemoveServiceModal',
      resolve: {
        services: function() {
          return services;
        },
        modalType: function() {
          return "remove";
        },
      },
    };
    ModalService.open(modalOptions);
  }

  function doSetOwnership(services) {
    var modalOptions = {
      component: 'ownershipServiceModal',
      resolve: {
        services: function() {
          return services;
        },
        users: resolveUsers,
        groups: resolveGroups,
      },
    };

    ModalService.open(modalOptions);

    /** @ngInject */
    function resolveUsers(CollectionsApi) {
      var options = {expand: 'resources', attributes: ['userid', 'name'], sort_by: 'name', sort_options: 'ignore_case'};

      return CollectionsApi.query('users', options);
    }

    /** @ngInject */
    function resolveGroups(CollectionsApi) {
      var options = {expand: 'resources', attributes: ['description'], sort_by: 'description', sort_options: 'ignore_case'};

      return CollectionsApi.query('groups', options);
    }
  }

  function doSetServiceRetirement(services) {
    var modalOptions = {
      component: 'retireServiceModal',
      resolve: {
        services: function() {
          return services;
        },
      },
    };
    ModalService.open(modalOptions);
  }

  function doRetireService(services) {
    var modalOptions = {
      component: 'retireRemoveServiceModal',
      resolve: {
        services: function() {
          return services;
        },
        modalType: function() {
          return "retire";
        },
      },
    };
    ModalService.open(modalOptions);
  }

  function paginationUpdate(limit, offset) {
    vm.limit = limit;
    vm.offset = offset;
    vm.resolveServices(limit, offset);
  }

  function editService() {
    doEditService(vm.selectedItemsList[0]);
  }

  function editTags() {
    doEditTags(vm.selectedItemsList);
  }

  function removeServices() {
    doRemoveServices(vm.selectedItemsList);
  }

  function setOwnership() {
    doSetOwnership(vm.selectedItemsList);
  }

  function setServiceRetirement() {
    doSetServiceRetirement(vm.selectedItemsList);
  }

  function retireService() {
    doRetireService(vm.selectedItemsList);
  }

  function editServiceItem(_action, item) {
    doEditService(item);
  }

  function editTagsItem(_action, item) {
    doEditTags([item]);
  }

  function removeServicesItem(_action, item) {
    doRemoveServices([item]);
  }

  function setOwnershipItem(_action, item) {
    doSetOwnership([item]);
  }

  function setServiceRetirementItem(_action, item) {
    doSetServiceRetirement([item]);
  }

  function retireServiceItem(_action, item) {
    doRetireService([item]);
  }
}

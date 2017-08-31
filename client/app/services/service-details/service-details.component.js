/* eslint camelcase: "off" */
import './_service-details.sass'
import templateUrl from './service-details.html'

export const ServiceDetailsComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  templateUrl,
  bindings: {}
}

/** @ngInject */
function ComponentController ($stateParams, $state, $window, CollectionsApi, EventNotifications, Chargeback, Consoles,
                              TagEditorModal, ModalService, PowerOperations, ServicesState, TaggingService, lodash,
                              Polling, LONG_POLLING_INTERVAL, UsageGraphsService) {
  const vm = this
  vm.$onInit = activate
  vm.$onDestroy = onDestroy

  function onDestroy () {
    Polling.stop('servicesPolling')
  }

  function activate () {
    vm.permissions = ServicesState.getPermissions()
    vm.storageChartConfigOptions = {'units': __('GB'), 'chartId': 'storageChart', 'label': __('used')}
    vm.memoryChartConfigOptions = {'units': __('GB'), 'chartId': 'memoryChart', 'label': __('used')}
    vm.cpuChartConfigOptions = {'units': __('MHz'), 'chartId': 'cpuChart', 'label': __('used')}

    angular.extend(vm, {
      serviceId: $stateParams.serviceId,
      loading: true,
      title: __('Service Details'),
      service: {},
      availableTags: [],
      credential: {},
      listActions: [],
      // Functions
      hasCustomButtons: hasCustomButtons,
      disableStopButton: disableStopButton,
      viewType: 'detailsView',
      viewSelected: viewSelected,
      disableSuspendButton: disableSuspendButton,
      disableStartButton: disableStartButton,
      toggleOpenResourceGroup: toggleOpenResourceGroup,
      openCockpit: openCockpit,
      openConsole: openConsole,
      processSnapshot: processSnapshot,
      startVM: startVM,
      stopVM: stopVM,
      suspendVM: suspendVM,
      retireVM: retireVM,
      retireVMFlag: false,
      gotoComputeResource: gotoComputeResource,
      gotoService: gotoService,
      gotoCatalogItem: gotoCatalogItem,
      createResourceGroups: createResourceGroups,
      cpuChart: UsageGraphsService.getChartConfig(vm.cpuChartConfigOptions),
      memoryChart: UsageGraphsService.getChartConfig(vm.memoryChartConfigOptions),
      storageChart: UsageGraphsService.getChartConfig(vm.storageChartConfigOptions),
      // Config setup
      headerConfig: getHeaderConfig(),
      resourceListConfig: {
        showSelectBox: false,
        checkDisabled: isResourceDisabled
      }
    })
    fetchResources(vm.serviceId)
    Polling.start('servicesPolling', startPollingService, LONG_POLLING_INTERVAL)
  }

  function startPollingService () {
    fetchResources(vm.serviceId, true)
  }

  function viewSelected (view) {
    vm.viewType = view
  }

  function getChartConfigs () {
    const allocatedStorage = UsageGraphsService.convertBytestoGb(vm.service.aggregate_all_vm_disk_space_allocated)
    const usedStorage = UsageGraphsService.convertBytestoGb(vm.service.aggregate_all_vm_disk_space_used)
    let usedMemory = 0
    let usedCPU = 0
    let totalCPU = 0
    const allocatedMemory = vm.service.aggregate_all_vm_memory / 1024 // this metric is in mb
    if (vm.service.vms) {
      vm.service.vms.forEach((instance) => {
        usedCPU += instance.cpu_usagemhz_rate_average_avg_over_time_period
        totalCPU += (angular.isDefined(instance.hardware.aggregate_cpu_speed) ? instance.hardware.aggregate_cpu_speed : 0)
        usedMemory += instance.max_mem_usage_absolute_average_avg_over_time_period
      })
    }

    usedMemory = UsageGraphsService.convertBytestoGb(usedMemory)
    vm.cpuChart = UsageGraphsService.getChartConfig(vm.cpuChartConfigOptions, usedCPU, totalCPU)
    vm.memoryChart = UsageGraphsService.getChartConfig(vm.memoryChartConfigOptions, usedMemory, allocatedMemory)
    vm.storageChart = UsageGraphsService.getChartConfig(vm.storageChartConfigOptions, usedStorage, allocatedStorage)
  }

  function fetchResources (id, refresh) {
    ServicesState.getService(id, refresh).then(handleSuccess, handleFailure)

    function handleSuccess (response) {
      vm.service = response
      vm.service.credential = []
      vm.title = vm.service.name
      getListActions()
      getChartConfigs()
      Chargeback.processReports(vm.service)
      vm.computeGroup = vm.createResourceGroups(vm.service)

      TaggingService.queryAvailableTags('services/' + id + '/tags/').then((response) => {
        vm.availableTags = response
      })
      vm.loading = false
    }

    function handleFailure (response) {
      EventNotifications.error(__('There was an error fetching this service. ') + response)
    }
  }

  function hasCustomButtons (service) {
    const actions = service.custom_actions || {}
    const groups = actions.button_groups || []
    const buttons = [].concat(actions.buttons, ...groups.map((g) => g.buttons))

    return lodash.compact(buttons).length > 0
  }

  function getListActions () {
    const lifeCycleActions = ServicesState.getLifeCycleCustomDropdown(setServiceRetirement, retireService)
    const configActions = ServicesState.getConfigurationCustomDropdown(editService, removeService, setOwnership)
    const policyActions = ServicesState.getPolicyCustomDropdown(editTags)
    const listActions = []

    if (angular.isUndefined(vm.service.type)) {
      const powerOptionsMenu = {
        title: __('Power Operations'),
        actionName: 'powerOperations',
        icon: 'fa fa-power-off',
        actions: [],
        isDisabled: false,
        tooltipText: __('Power Operations')
      }
      // TODO: once service_control rbac operations are available, gate the following actions
      const powerOptionsActions = [
        {
          name: __('Start'),
          actionName: 'start',
          title: __('Start the Service'),
          actionFn: startService,
          permission: true,
          isDisabled: disableStartButton(vm.service)
        }, {
          name: __('Stop'),
          actionName: 'stop',
          title: __('Stop the Service'),
          actionFn: stopService,
          permission: true,
          isDisabled: disableStopButton(vm.service)
        }, {
          name: __('Suspend'),
          actionName: 'suspend',
          title: __('Suspend the Service'),
          actionFn: suspendService,
          permission: true,
          isDisabled: disableSuspendButton(vm.service)
        }
      ]
      angular.forEach(powerOptionsActions, (menuOption) => {
        if (menuOption.permission) {
          powerOptionsMenu.actions.push(menuOption)
        }
      })
      if (powerOptionsMenu.actions.length > 0) {
        listActions.push(powerOptionsMenu)
      }
    }

    if (lifeCycleActions) {
      listActions.push(lifeCycleActions)
    }

    if (policyActions) {
      listActions.push(policyActions)
    }

    if (configActions) {
      if (angular.isDefined(lodash.find(vm.service.actions, {'name': 'reconfigure'})) && vm.permissions.reconfigure) {
        configActions.actions.push(
          {
            icon: 'fa fa-cog',
            name: __('Reconfigure'),
            actionName: 'reconfigure',
            title: __('Reconfigure the Service'),
            actionFn: reconfigureService,
            isDisabled: false
          }
        )
      }
      listActions.push(configActions)
    }

    vm.listActions = listActions
  }

  function disableStartButton (item) {
    return !PowerOperations.allowStartService(item)
  }

  function disableStopButton (item) {
    return !PowerOperations.allowStopService(item)
  }

  function disableSuspendButton (item) {
    return !PowerOperations.allowSuspendService(item)
  }

  function startService () {
    PowerOperations.startService(vm.service)
    getListActions()
  }

  function stopService () {
    PowerOperations.stopService(vm.service)
    getListActions()
  }

  function suspendService () {
    PowerOperations.suspendService(vm.service)
    getListActions()
  }

  function getHeaderConfig () {
    return {
      actionsConfig: {
        actionsInclude: true
      }
    }
  }

  function editService () {
    const modalOptions = {
      component: 'editServiceModal',
      resolve: {
        service: function () {
          return vm.service
        }
      }
    }
    ModalService.open(modalOptions)
  }

  function editTags () {
    TagEditorModal.showModal(vm.service, vm.availableTags)
  }

  function removeService () {
    CollectionsApi.delete('services', vm.service.id).then(removeSuccess, removeFailure)

    function removeSuccess () {
      EventNotifications.success(vm.service.name + __(' was removed.'))
      $state.go('services')
    }

    function removeFailure (_data) {
      EventNotifications.error(__('There was an error removing this service.'))
    }
  }

  function setOwnership () {
    const modalOptions = {
      component: 'ownershipServiceModal',
      resolve: {
        services: function () {
          return [vm.service]
        },
        users: resolveUsers,
        groups: resolveGroups
      }
    }

    ModalService.open(modalOptions)

    /** @ngInject */
    function resolveUsers (CollectionsApi) {
      const options = {
        expand: 'resources',
        attributes: ['userid', 'name'],
        sort_by: 'name',
        sort_options: 'ignore_case'
      }

      return CollectionsApi.query('users', options)
    }

    /** @ngInject */
    function resolveGroups (CollectionsApi) {
      const options = {
        expand: 'resources',
        attributes: ['description'],
        sort_by: 'description',
        sort_options: 'ignore_case'
      }

      return CollectionsApi.query('groups', options)
    }
  }

  function reconfigureService () {
    $state.go('services.reconfigure', {serviceId: vm.service.id})
  }

  function setServiceRetirement () {
    const modalOptions = {
      component: 'retireServiceModal',
      resolve: {
        services: function () {
          return [vm.service]
        }
      }
    }
    ModalService.open(modalOptions)
  }

  function retireService () {
    const data = {action: 'retire'}
    CollectionsApi.post('services', vm.service.id, {}, data).then(retireSuccess, retireFailure)

    function retireSuccess () {
      EventNotifications.success(vm.service.name + __(' was retired.'))
      $state.go('services')
    }

    function retireFailure () {
      EventNotifications.error(__('There was an error retiring this service.'))
    }
  }

  function createResourceGroups (service) {
    return {
      title: __('Compute'),
      open: true,
      resourceTypeClass: 'pficon pficon-screen',
      emptyMessage: __('There are no Compute Resources for this service.'),
      resources: service.vms || []
    }
  }

  function toggleOpenResourceGroup (group) {
    group.open = !group.open
  }

  function openConsole (item) {
    if (item['supports_console?'] && item.power_state === 'on') {
      Consoles.open(item.id)
    }
  }

  function openCockpit (item) {
    if (item['supports_launch_cockpit?'] && item.power_state === 'on') {
      $window.open('http://' + item.ipaddresses[0] + ':9090')
    }
  }

  function gotoComputeResource (resource) {
    $state.go('services.resource-details', {serviceId: vm.serviceId, vmId: resource.id})
  }

  function startVM (item, isDisabled) {
    if (!isDisabled) {
      PowerOperations.startVm(item)
    }
  }

  function stopVM (item, isDisabled) {
    if (!isDisabled) {
      PowerOperations.stopVm(item)
    }
  }

  function suspendVM (item, isDisabled) {
    if (!isDisabled) {
      PowerOperations.suspendVm(item)
    }
  }

  function retireVM (item, isDisabled) {
    if (!isDisabled) {
      PowerOperations.retireVM(item)
    }
  }

  function gotoCatalogItem () {
    $state.go('catalogs.details', {serviceTemplateId: vm.service.service_template.id})
  }

  function gotoService (service) {
    $state.go('services.details', {serviceId: service.id})
  }

  function isResourceDisabled (item) {
    return item.retired
  }

  function processSnapshot (item) {
    const modalOptions = {
      component: 'processSnapshotsModal',
      resolve: {
        vm: () => item,
        modalType: () => 'create'
      },
      size: 'lg'
    }
    ModalService.open(modalOptions)
  }
}

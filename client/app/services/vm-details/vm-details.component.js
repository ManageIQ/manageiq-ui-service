/* eslint-disable no-unused-expressions */
import './_vm-details.sass'
import templateUrl from './vm-details.html'

export const VmDetailsComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  templateUrl
}

/** @ngInject */
function ComponentController ($state, $stateParams, VmsService, ServicesState, sprintf, lodash,
                              EventNotifications, Polling, ModalService, PowerOperations, LONG_POLLING_INTERVAL, UsageGraphsService) {
  const vm = this
  vm.$onInit = activate
  vm.$onDestroy = onDestroy
  vm.hasUsageGraphs = true
  vm.startVm = startVM
  vm.stopVm = stopVM
  vm.suspendVM = suspendVM
  vm.getListActions = getListActions
  vm.getSnapshotListActions = getSnapshotListActions
  vm.viewSnapshots = viewSnapshots
  vm.processSnapshot = processSnapshot
  vm.pollVM = pollVM
  vm.retireVM = retireVM
  vm.getData = resolveData
  vm.storageChartConfigOptions = {'units': __('GB'), 'chartId': 'storageChart', 'label': __('used')}
  vm.memoryChartConfigOptions = {'units': __('GB'), 'chartId': 'memoryChart', 'label': __('used')}
  vm.cpuChartConfigOptions = {'units': __('MHz'), 'chartId': 'cpuChart', 'label': __('used')}
  vm.processInstanceVariables = processInstanceVariables
  vm.elapsed = elapsed

  function onDestroy () {
    Polling.stop('vmPolling')
  }

  function activate () {
    vm.permissions = VmsService.getPermissions()
    angular.extend(vm, {
      hasCustomButtons: hasCustomButtons,
      loading: true,
      presentDate: new Date(),
      neverText: __('Never'),
      noneText: __('None'),
      availableText: __('Available'),
      notAvailable: __('Not Available'),
      vmDetails: {},
      viewType: $stateParams.viewType || 'detailsView',
      viewSelected: viewSelected,
      instance: {},
      snapshotListActions: {},
      cpuChart: UsageGraphsService.getChartConfig(vm.cpuChartConfigOptions),
      memoryChart: UsageGraphsService.getChartConfig(vm.memoryChartConfigOptions),
      storageChart: UsageGraphsService.getChartConfig(vm.storageChartConfigOptions),
      // Config
      headerConfig: {
        actionsConfig: {
          actionsInclude: true
        }
      },
      listActions: [],
      test: {
        'title': 'SAMPLE',
        'href': '#',
        'iconClass': 'fa fa-shield',
        'notifications': [
          {
            'iconClass': 'pficon pficon-error-circle-o',
            'href': '#'
          }
        ]
      },
      power_state: {
        'title': 'Power State',
        'href': '#',
        'notifications': [
          {
            'iconClass': 'pficon pficon-unknown',
            'href': '#'
          }
        ]
      },
      compliance: {
        'title': 'Compliance',
        'href': '#',
        'notifications': [
          {
            'iconClass': 'pficon pficon-unknown',
            'href': '#'
          }
        ]
      },
      retirement: {
        'title': 'Retirement',
        'href': '#',
        'notifications': [
          {
            'iconClass': 'fa fa-clock-o',
            'href': '#'
          }
        ]
      },
      snapshots: {
        'title': 'Snapshots',
        'href': '#',
        'notifications': [
          {
            'iconClass': 'fa fa-camera',
            'href': '#'
          }
        ]
      }
    })

    EventNotifications.info(__('The contents of this page is a function of the current users\'s group.'))
    resolveData()
    Polling.start('vmPolling', pollVM, LONG_POLLING_INTERVAL)
  }

  // Private
  function startVM () {
    PowerOperations.startVm(vm.vmDetails)
  }

  function stopVM () {
    PowerOperations.stopVm(vm.vmDetails)
  }

  function suspendVM () {
    PowerOperations.suspendVm(vm.vmDetails)
  }

  function retireVM () {
    PowerOperations.retireVM(vm.vmDetails)
  }

  function viewSelected (view) {
    vm.viewType = view
  }

  function pollVM () {
    resolveData(true)
  }

  function processSnapshot () {
    const modalOptions = {
      component: 'processSnapshotsModal',
      resolve: {
        vm: () => vm.vmDetails,
        modalType: () => 'create'
      },
      size: 'lg'
    }
    ModalService.open(modalOptions)
  }

  function viewSnapshots () {
    $state.go('vms.snapshots', {vmId: vm.vmDetails.id})
  }

  function resolveData (refresh) {
    return VmsService.getVm($stateParams.vmId, refresh).then(handleSuccess, handleFailure)

    function handleSuccess (response) {
      vm.vmDetails = response
      vm.lifecycleListActions = [VmsService.getLifeCycleCustomDropdown(retireVM, vm.vmDetails.name)]
      const allocatedStorage = UsageGraphsService.convertBytestoGb(vm.vmDetails.allocated_disk_storage) // convert bytes to gb
      const usedStorage = UsageGraphsService.convertBytestoGb(vm.vmDetails.used_storage)
      const totalMemory = vm.vmDetails.ram_size / 1024
      const usedMemory = UsageGraphsService.convertBytestoGb(vm.vmDetails.max_mem_usage_absolute_average_avg_over_time_period)
      const usedCPU = vm.vmDetails.cpu_usagemhz_rate_average_avg_over_time_period
      const totalCPU = (angular.isDefined(vm.vmDetails.hardware.aggregate_cpu_speed) ? vm.vmDetails.hardware.aggregate_cpu_speed : 0)
      if (response.cloud) {
        VmsService.getInstance(response.id).then((response) => {
          vm.instance = response
          processInstanceVariables(vm.instance)
        })
      }
      hasUsageGraphs()

      vm.snapshots.notifications[0].count = response.v_total_snapshots
      vm.retirement.notifications[0].count = angular.isUndefined(response.retires_on) ? vm.neverText : response.retires_on
      vm.compliance.notifications[0].count = angular.isUndefined(response.last_compliance_status) ? vm.neverText : response.last_compliance_status
      vm.compliance.notifications[0].iconClass = angular.isUndefined(response.last_compliance_status) ? 'pficon pficon-unknown'
        : response.last_compliance_status === 'compliant'? 'pficon pficon-error-circle-o': 'pficon pficon-ok'

      vm.power_state.notifications[0].iconClass = response.power_state === 'on'? 'pficon pficon-ok' : 'pficon pficon-error-circle-o'


      vm.vmDetails.lastSyncOn = (angular.isUndefined(vm.vmDetails.last_sync_on) ? vm.neverText : vm.vmDetails.last_sync_on)
      vm.vmDetails.resourceAvailability = (vm.vmDetails.template === false ? vm.availableText : vm.noneText)
      vm.vmDetails.driftHistory = defaultText(vm.vmDetails.drift_states)
      vm.vmDetails.scanHistoryCount = defaultText(vm.vmDetails.scan_histories)
      vm.vmDetails.lastComplianceStatus = (angular.isUndefined(vm.vmDetails.last_compliance_status) ? __('Never Verified') : vm.vmDetails.last_compliance_status)
      vm.vmDetails.complianceHistory = (vm.vmDetails.compliances.length > 0 ? vm.availableText : vm.notAvailable)
      vm.vmDetails.provisionDate = angular.isDefined(vm.vmDetails.service.miq_request) ? vm.vmDetails.service.miq_request.fulfilled_on : __('Unknown')
      vm.vmDetails.containerSpecsText = vm.vmDetails.vendor + ': ' + vm.vmDetails.hardware.cpu_total_cores + ' CPUs (' + vm.vmDetails.hardware.cpu_sockets +
        ' sockets x ' + vm.vmDetails.hardware.cpu_cores_per_socket + ' core), ' + vm.vmDetails.hardware.memory_mb + ' MB'
      vm.cpuChart = UsageGraphsService.getChartConfig(vm.cpuChartConfigOptions, usedCPU, totalCPU)
      vm.memoryChart = UsageGraphsService.getChartConfig(vm.memoryChartConfigOptions, usedMemory, totalMemory)
      vm.storageChart = UsageGraphsService.getChartConfig(vm.storageChartConfigOptions, usedStorage, allocatedStorage)
      if (vm.vmDetails.retired) {
        EventNotifications.clearAll(lodash.find(EventNotifications.state().groups, {notificationType: 'warning'}))
        EventNotifications.warn(sprintf(__('%s is a retired resource'), vm.vmDetails.name), {
          persistent: true,
          unread: false
        })
      }
      getListActions()
      getSnapshotListActions()
      hasCustomButtons()
      vm.loading = false
    }

    function handleFailure (_error) {
      EventNotifications.error(__('There was an error loading the vm details.'))
    }
  }

  function hasCustomButtons () {
    const actions = vm.vmDetails.custom_actions || {}
    const groups = actions.button_groups || []
    const buttons = [].concat(actions.buttons, ...groups.map((g) => g.buttons))

    return lodash.compact(buttons).length > 0
  }

  function getSnapshotListActions () {
    const snapshotOptionsMenu = {
      title: __('Snapshots'),
      name: __('Snapshots'),
      actionName: 'snapshotOperations',
      icon: 'fa fa-camera',
      actions: [],
      isDisabled: false
    }
    const snapshotOptionsActions = [
      {
        name: __('View'),
        actionName: 'view',
        title: __('View snapshots'),
        actionFn: viewSnapshots,
        permission: vm.permissions.snapshotsView
      },
      {
        name: __('Create'),
        actionName: 'create',
        title: __('Create snapshots'),
        actionFn: processSnapshot,
        permission: vm.permissions.snapshotsAdd
      }
    ]
    snapshotOptionsMenu.actions = VmsService.checkMenuPermissions(snapshotOptionsActions)
    vm.snapshotListActions = [snapshotOptionsMenu]

    return vm.snapshotListActions
  }

  function hasUsageGraphs () {
    if (angular.isUndefined(vm.vmDetails.allocated_disk_storage) || vm.vmDetails.allocated_disk_storage === 0) {
      vm.usageGraphs = false
    }
    if (angular.isUndefined(vm.vmDetails.max_mem_usage_absolute_average_avg_over_time_period) ||
      vm.vmDetails.max_mem_usage_absolute_average_avg_over_time_period === 0) {
      vm.usageGraphs = false
    }
    if (angular.isUndefined(vm.vmDetails.hardware.aggregate_cpu_speed) ||
      vm.vmDetails.hardware.aggregate_cpu_speed === 0) {
      vm.usageGraphs = false
    }

    return vm.usageGraphs
  }

  function getListActions () {
    vm.listActions = []
    const powerOptionsMenu = {
      title: __('Power Operations'),
      name: __('Power'),
      actionName: 'powerOperations',
      icon: 'fa fa-power-off',
      actions: [],
      isDisabled: false
    }
    const powerOptionsActions = [
      {
        icon: 'fa fa-play',
        name: __('Start'),
        actionName: 'start',
        title: __('Start the Service'),
        actionFn: startVM,
        permission: vm.permissions.start,
        isDisabled: vm.vmDetails.power_state === 'on'
      }, {
        icon: 'fa fa-stop',
        name: __('Stop'),
        actionName: 'stop',
        title: __('Stop the Service'),
        actionFn: stopVM,
        permission: vm.permissions.stop,
        isDisabled: vm.vmDetails.power_state !== 'on'
      }, {
        icon: 'fa fa-pause',
        name: __('Suspend'),
        actionName: 'suspend',
        title: __('Suspend the Service'),
        actionFn: suspendVM,
        permission: vm.permissions.suspend,
        isDisabled: vm.vmDetails.power_state !== 'on'
      }
    ]

    powerOptionsMenu.actions = VmsService.checkMenuPermissions(powerOptionsActions)
    if (powerOptionsMenu.actions.length) {
      vm.listActions.push(powerOptionsMenu)
    }

    return vm.listActions
  }

  function defaultText (inputCount, defaultText) {
    const inputArrSize = inputCount.length
    defaultText = (defaultText === null ? 'None' : defaultText)
    if (inputArrSize === 0) {
      return __(defaultText)
    } else {
      return inputArrSize
    }
  }

  function processInstanceVariables (data) {
    data.availabilityZone = (angular.isUndefined(data.availability_zone) ? vm.noneText : data.availability_zone.name)
    data.cloudTenant = (angular.isUndefined(data.cloud_tenant) ? vm.noneText : data.cloud_tenant)
    data.orchestrationStack = (angular.isUndefined(data.orchestration_stack) ? vm.noneText : data.orchestration_stack)
    data.keyPairLabels = []
    data.key_pairs.forEach(function (keyPair) {
      data.keyPairLabels.push(keyPair.name)
    })

    vm.vmDetails.instance = data

    return vm.vmDetails.instance
  }


  function elapsed (finish, start) {
    return Math.abs(new Date(finish) - new Date(start)) / 100
  }
}

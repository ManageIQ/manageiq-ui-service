import './_resource-details.sass'
import templateUrl from './resource-details.html'

export const ResourceDetailsComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  templateUrl
}

/** @ngInject */
function ComponentController ($state, $stateParams, VmsService, ServicesState, sprintf, lodash,
                              EventNotifications, Polling, ModalService, PowerOperations, LONG_POLLING_INTERVAL,
                              TaggingService, UsageGraphsService) {
  const vm = this
  vm.$onInit = activate
  vm.$onDestroy = onDestroy

  function onDestroy () {
    Polling.stop('vmPolling')
  }

  function activate () {
    vm.permissions = ServicesState.getPermissions()
    angular.extend(vm, {
      elapsed: elapsed,
      availableTooltip: availableTooltip,
      usedTooltip: usedTooltip,
      hasCustomButtons: hasCustomButtons,
      getSnapshotListActions: getSnapshotListActions,
      processSnapshot: processSnapshot,
      pollVM: pollVM,
      retireVM: retireVM,
      processInstanceVariables: processInstanceVariables,
      getListActions: getListActions,
      viewSnapshots: viewSnapshots,
      startVm: startVM,
      stopVm: stopVM,
      suspendVM: suspendVM,
      resolveData: resolveData,
      ssAnalysis: getSsAnalysis(),
      // Config
      listActions: [],
      instance: {},
      snapshotListActions: {},
      loading: true,
      presentDate: new Date(),
      neverText: __('Never'),
      noneText: __('None'),
      availableText: __('Available'),
      notAvailable: __('Not Available'),
      vmDetails: {},
      headerConfig: {
        actionsConfig: {
          actionsInclude: true
        }
      },
      genInfo: {
        'iconClass': 'pficon pficon-service',
        'info': []
      },
      provInfo: {
        'info': []
      },
      powerState: {
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
      },
      emptyState: {icon: 'pficon pficon-help', title: 'No Information Available'}
    })
    resolveData()
  }

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
    if (!refresh) {
      Polling.stop('vmPolling')
    }

    return VmsService.getVm($stateParams.vmId, refresh).then(handleSuccess, handleFailure)

    function handleSuccess (response) {
      Polling.start('vmPolling', pollVM, LONG_POLLING_INTERVAL)
      vm.vmDetails = response

      const retirementDate = new Date(response.retires_on)

      TaggingService.queryAvailableTags('vms/' + response.id + '/tags/').then((response) => {
        vm.availableTags = response
      })

      if (response.cloud) {
        VmsService.getInstance(response.id).then((response) => {
          vm.instance = response
          processInstanceVariables(vm.instance)
        })
      }

      VmsService.getMetrics($stateParams.vmId, {
        capture_interval: 'hourly'
      }).then((response) => {
        vm.metrics = response
        const lastHour = response.resources[0]
        vm.cpuUtil = UsageGraphsService.getChartConfig({
          'units': __('%'),
          'chartId': 'cpuChart',
          'label': __('used')
        }, (lastHour.cpu_usage_rate_average * 100).toPrecision(3), 100)

        vm.memUtil = UsageGraphsService.getChartConfig({
          'units': __('GB'),
          'chartId': 'memoryChart',
          'label': __('used')
        }, UsageGraphsService.convertBytestoGb(lastHour.derived_memory_used * 1048576), UsageGraphsService.convertBytestoGb(lastHour.derived_memory_available * 1048576))

        vm.stoUtil = UsageGraphsService.getChartConfig({
          'units': __('GB'),
          'chartId': 'storageChart',
          'label': __('used')
        }, UsageGraphsService.convertBytestoGb(lastHour.derived_vm_allocated_disk_storage), UsageGraphsService.convertBytestoGb(lastHour.derived_vm_allocated_disk_storage))
      })

      vm.diskUsage = response.disks.map((item) => {
        const totalSize = item.size || response.allocated_disk_storage || 0
        const used = item.size_on_disk || 0

        return Object.assign(
          {
            data: {
              'used': UsageGraphsService.convertBytestoGb(used),
              'total': UsageGraphsService.convertBytestoGb(totalSize)
            },
            units: 'GB',
            layout: {
              'type': 'inline'
            }
          },
          item)
      })

      hasUsageGraphs()
      vm.genInfo.info = [
        response.name,
        response.hostnames.join(',') || 'No hostnames',
        response.ipaddresses.join(',') || 'No IP addresses',
        response.hardware.guest_os_full_name
      ]
      vm.provInfo.info = [
        response.vendor,
        `${response.vendor}: ${response.hardware.cpu_total_cores} CPUs (${response.hardware.cpu_sockets} sockets x ${response.hardware.cpu_cores_per_socket} core), ${response.hardware.memory_mb} MB`
      ]
      vm.ssAnalysis.users.value = response.users.length
      vm.ssAnalysis.groups.value = response.groups.length
      vm.ssAnalysis.instance.value = response.instance ? response.instance.keyPairLabels.join(',') : vm.noneText
      vm.ssAnalysis.guest_applications.value = response.guest_applications.length
      vm.ssAnalysis.linux_initprocesses.value = response.linux_initprocesses.length
      vm.ssAnalysis.files.value = response.files.length

      vm.snapshots.notifications[0].count = response.v_total_snapshots
      vm.retirement.notifications[0].count = angular.isUndefined(response.retires_on) ? vm.neverText
        : `${retirementDate.getFullYear()}-${retirementDate.getMonth()}-${retirementDate.getDate()}`
      vm.compliance.notifications[0].count = angular.isUndefined(response.last_compliance_status) ? vm.neverText : response.last_compliance_status
      vm.compliance.notifications[0].iconClass = angular.isUndefined(response.last_compliance_status) ? 'pficon pficon-unknown'
        : response.last_compliance_status === 'compliant' ? 'pficon pficon-error-circle-o' : 'pficon pficon-ok'
      vm.powerState.notifications[0].iconClass = response.power_state === 'on' ? 'pficon pficon-ok'
        : response.power_state === 'off' ? 'pficon pficon-error-circle-o' : 'pficon pficon-unknown'
      vm.vmDetails.complianceHistory = (vm.vmDetails.compliances.length > 0 ? vm.availableText : vm.notAvailable)

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
        permission: vm.permissions.viewSnapshots
      },
      {
        name: __('Create'),
        actionName: 'create',
        title: __('Create snapshots'),
        actionFn: processSnapshot,
        permission: vm.permissions.vm_snapshot_add
      }
    ]
    snapshotOptionsActions.forEach((menuOption) => menuOption.permission ? snapshotOptionsMenu.actions.push(menuOption) : null)
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

  function getSsAnalysis () {
    return {
      users: {
        title: 'Users',
        icon: 'pficon pficon-user'
      },
      groups: {
        title: 'Groups',
        icon: 'pficon pficon-users'
      },
      instance: {
        title: 'Key Pairs'
      },
      guest_applications: {
        title: 'Packages',
        icon: 'ff ff-software-package'
      },
      linux_initprocesses: {
        title: 'Init Processes',
        icon: 'fa fa-cog'
      },
      files: {
        title: 'Files',
        icon: 'fa fa-file-o'
      }
    }
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
        permission: vm.permissions.instanceStart,
        isDisabled: vm.vmDetails.power_state === 'on'
      }, {
        icon: 'fa fa-stop',
        name: __('Stop'),
        actionName: 'stop',
        title: __('Stop the Service'),
        actionFn: stopVM,
        permission: vm.permissions.instanceStop,
        isDisabled: vm.vmDetails.power_state !== 'on'
      }, {
        icon: 'fa fa-pause',
        name: __('Suspend'),
        actionName: 'suspend',
        title: __('Suspend the Service'),
        actionFn: suspendVM,
        permission: vm.permissions.instanceSuspend,
        isDisabled: vm.vmDetails.power_state !== 'on'
      }, {
        icon: 'fa fa-clock-o',
        name: __('Retire'),
        actionName: 'retire',
        title: __('Retire the Service'),
        actionFn: retireVM,
        permission: vm.permissions.instanceRetire,
        isDisabled: vm.vmDetails.power_state !== 'on'
      }
    ]
    powerOptionsActions.forEach((menuOption) => menuOption.permission ? powerOptionsMenu.actions.push(menuOption) : false)
    if (powerOptionsMenu.actions.length) {
      vm.listActions.push(powerOptionsMenu)
    }

    return vm.listActions
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

  function availableTooltip (item) {
    return `<div>Title: ${item.device_name}</div><div>Available: ${item.data.total - item.data.used}GB</div><div>Device Type: ${item.device_type}</div>`
  }

  function usedTooltip (item) {
    return `<div>Title: ${item.device_name}</div><div>Usage: ${item.data.used}GB</div><div>Device Type: ${item.device_type}</div>`
  }
}

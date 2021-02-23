/* eslint no-undef: "off" */

import './_resource-details.sass'
import template from './resource-details.html';

export const ResourceDetailsComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  template,
}

/** @ngInject */
function ComponentController ($state, $stateParams, VmsService, lodash, EventNotifications, Polling, ModalService,
                              PowerOperations, LONG_POLLING_INTERVAL, TaggingService, UsageGraphsService) {
  const vm = this
  vm.$onInit = activate
  vm.$onDestroy = onDestroy

  function onDestroy () {
    Polling.stop('vmPolling')
  }

  function activate () {
    vm.permissions = VmsService.getPermissions()
    angular.extend(vm, {
      elapsed: elapsed,
      availableTooltip: availableTooltip,
      usedTooltip: usedTooltip,
      customButtonCount: customButtonCount,
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
        'info': __('No data available')
      },
      provInfo: {
        'info': [__('No data available')]
      },
      compliance: {
        'title': 'Compliance',
        'notifications': [
          {
            'iconClass': 'pficon pficon-unknown'
          }
        ]
      },
      retirement: {
        'title': 'Retirement',
        'notifications': [
          {
            'iconClass': 'pficon pficon-unknown'
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
      emptyState: {icon: 'pficon pficon-help', title: __('No data available')}
    })
    vm.today = new Date()
    vm.presentDate = new Date()
    vm.lastWeekDay = new Date(vm.presentDate.setDate(vm.presentDate.getDate() - 7))
    vm.tlOptions = {
      start: new Date(vm.lastWeekDay),
      end: new Date(vm.today),
      eventClick: tlTooltip,
      eventGrouping: 60000,
      minScale: 0.234,
      maxScale: 1440
    }
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
      const eventOptions = {timestamp: `>${vm.lastWeekDay.getFullYear()}-${vm.lastWeekDay.getMonth() + 1}-${vm.lastWeekDay.getDate()}`}
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

      VmsService.getEvents($stateParams.vmId, eventOptions).then((response) => {
        const start = new Date(lodash.minBy(response.resources, 'created_on').created_on)
        const end = new Date(lodash.maxBy(response.resources, 'created_on').created_on)
        const tlEvents = response.resources.map((item) => {
          switch (item.event_type) {
            case 'request_vm_start':
            case 'request_vm_poweroff':
            case 'request_vm_reset':
            case 'request_vm_suspend':
            case 'vm_start':
            case 'vm_poweroff':
            case 'vm_reset':
            case 'vm_suspend':
            case 'vm_create':
              return {
                'date': new Date(item.created_on),
                'details': {'event': item.event_type, 'object': item.event_type, item}
              }
          }
        })

        vm.tlData = [{
          'data': tlEvents.filter(Boolean),
          'display': true
        }]

        vm.tlOptions = {
          start: new Date(start.setHours(start.getHours() - 2)),
          end: new Date(end.setHours(end.getHours() + 2)),
          eventClick: tlTooltip,
          eventGrouping: 60000,
          minScale: 0.234,
          maxScale: 1440
        }
      })

      VmsService.getMetrics($stateParams.vmId, {
        capture_interval: 'hourly'
      }).then((response) => {
        vm.metrics = response
        const lastHour = response.resources.find((item) => {
          return new Date(item.timestamp).getUTCHours() === (vm.today.getUTCHours() - 1)
        })

        if (lastHour.cpu_usage_rate_average) {
          vm.cpuUtil = UsageGraphsService.getChartConfig({
            'units': __('%'),
            'chartId': 'cpuChart',
            'label': __('used')
          }, (lastHour.cpu_usage_rate_average).toPrecision(3), 100)
        }
        vm.memUtil = UsageGraphsService.getChartConfig({
          'units': __('GB'),
          'chartId': 'memoryChart',
          'label': __('used')
        }, UsageGraphsService.convertBytestoGb(lastHour.derived_memory_used * 1048576), UsageGraphsService.convertBytestoGb(lastHour.derived_memory_available * 1048576))

        vm.stoUtil = UsageGraphsService.getChartConfig({
          'units': __('GB'),
          'chartId': 'storageChart',
          'label': __('used')
        }, UsageGraphsService.convertBytestoGb(lastHour.derived_vm_used_disk_storage), UsageGraphsService.convertBytestoGb(lastHour.derived_vm_allocated_disk_storage))
      })

      vm.diskUsage = response.disks.map((item) => {
        const totalSize = item.size || 0
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

      const POWERSTATE = response.power_state === 'on' ? 'pficon pficon-ok'
        : response.power_state === 'off' ? 'pficon pficon-error-circle-o'
          : response.power_state === 'suspended' ? 'pficon pficon-paused' : 'pficon pficon-unknown'
      vm.genInfo.nameRow = `<i class="${POWERSTATE}"></i> <b>${response.name}</b>`
      vm.genInfo.osnameRow = response.hardware.guest_os_full_name || response.hardware.guest_os || 'No OS full name'
      vm.genInfo.ipRowPopover = `${response.ipaddresses.length} IP Addresses:
          ${response.ipaddresses.map(item => `<div>${item}</div>`).join('\n')}`
      vm.genInfo.hostnameRowPopover = `${response.hostnames.length} Hostnames:
          ${response.hostnames.map(item => `<div>${item}</div>`).join('\n')}`
      vm.provInfo.info = [
        `<b>${response.vendor}</b>`,
        response.ext_management_system ? response.ext_management_system.name : __('(no provider)'),
        `${response.hardware.cpu_total_cores} CPUs (${response.hardware.cpu_sockets} sockets x ${response.hardware.cpu_cores_per_socket} core)`,
        `${response.hardware.memory_mb} MB`
      ]
      vm.genInfo.iconImage = `images/os/os-${response.os_image_name}.svg`
      vm.provInfo.iconImage = `images/providers/vendor-${response.vendor}.svg`
      vm.ssAnalysis.users.value = response.users.length
      vm.ssAnalysis.groups.value = response.groups.length
      vm.ssAnalysis.instance.value = response.instance ? response.instance.keyPairLabels.join(',') : vm.noneText
      vm.ssAnalysis.guest_applications.value = response.guest_applications.length
      vm.ssAnalysis.linux_initprocesses.value = response.linux_initprocesses.length
      vm.ssAnalysis.files.value = response.files.length
      vm.snapshots.notifications[0].count = response.v_total_snapshots
      vm.retirement.notifications[0].count = response.retires_on === null ? vm.neverText
        : `${retirementDate.getFullYear()}-${retirementDate.toString().split(' ')[1]}-${retirementDate.getDate()}`
      vm.retirement.notifications[0].iconClass = response.retires_on === null ? ''
        : `fa fa-clock-o`
      vm.compliance.notifications[0].count = angular.isUndefined(response.last_compliance_status) ? `Never Verified`
        : lodash.capitalize(response.last_compliance_status)
      vm.compliance.notifications[0].iconClass = angular.isUndefined(response.last_compliance_status) ? ''
        : response.last_compliance_status ? 'pficon pficon-ok' : 'pficon pficon-error-circle-o'
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

  function customButtonCount () {
    const actions = vm.vmDetails.custom_actions || {}
    const groups = actions.button_groups || []
    const buttons = actions.buttons || []
    const allButtons = groups.length + buttons.length

    return allButtons
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
    snapshotOptionsActions.forEach((menuOption) => menuOption.permission ? snapshotOptionsMenu.actions.push(menuOption) : null)
    if (snapshotOptionsMenu.actions.length) {
      vm.snapshotListActions = [snapshotOptionsMenu]
    }

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
    return Math.abs(new Date(finish) - new Date(start)) / 1000
  }

  function availableTooltip (item) {
    return `<div>Title: ${item.device_name}</div><div>Available: ${item.data.total - item.data.used}GB</div><div>Device Type: ${item.device_type}</div>`
  }

  function usedTooltip (item) {
    return `<div>Title: ${item.device_name}</div><div>Usage: ${item.data.used}GB</div><div>Device Type: ${item.device_type}</div>`
  }

  const tlTooltip = (item) => {
    d3.select('body').selectAll('.popover').remove()
    const fontSize = 12 // in pixels
    const tooltipWidth = 9 // in rem
    const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'popover fade bottom in')
    .attr('role', 'tooltip')
    .on('mouseleave', () => {
      d3.select('body').selectAll('.popover').remove()
    })
    const rightOrLeftLimit = fontSize * tooltipWidth
    const direction = d3.event.pageX > rightOrLeftLimit ? 'right' : 'left'
    const left = direction === 'right' ? d3.event.pageX - rightOrLeftLimit : d3.event.pageX
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    }

    function eventDetails (event) {
      return `
          <div>Event Type: ${event.details.item.event_type}</div> 
          <div>Message: ${event.details.item.message}</div> 
          <div>Created On: ${event.date.toLocaleDateString('en-US', options)}</div>   
          `
    }

    tooltip.html(
      `
        <div class="arrow"></div>
        <div class="popover-content">
            ${item.events ? `<b>Group of ${item.events.length} events</b>  ${item.events.map(event => `${eventDetails(event)}<hr>`).join('\n')}`
        : `${eventDetails(item)}`}    
        </div>
      `
    )
    tooltip
    .style('left', `${left}px`)
    .style('top', `${d3.event.pageY + 8}px`)
    .style('display', 'block')
  }
}

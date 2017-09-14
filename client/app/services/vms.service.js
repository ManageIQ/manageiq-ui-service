/* eslint camelcase: "off" */

/** @ngInject */
export function VmsService (CollectionsApi, RBAC) {
  const collection = 'vms'
  const sort = {
    isAscending: true,
    currentField: {id: 'name', title: __('Name'), sortType: 'alpha'}
  }
  let filters = []
  let permissions = getPermissions()
  return {
    checkMenuPermissions: checkMenuPermissions,
    createSnapshots: createSnapshots,
    deleteSnapshots: deleteSnapshots,
    getVm: getVm,
    getSort: getSort,
    setSort: setSort,
    permissions: permissions,
    getFilters: getFilters,
    setFilters: setFilters,
    getInstance: getInstance,
    getSnapshots: getSnapshots,
    getPermissions: getPermissions,
    getLifeCycleCustomDropdown: getLifeCycleCustomDropdown,
    revertSnapshot: revertSnapshot
  }

  function getSnapshots (vmId) {
    const options = {
      attributes: [],
      expand: ['resources'],
      filter: getQueryFilters(getFilters())
    }

    options.sort_by = getSort().currentField.id
    options.sort_options = getSort().currentField.sortType === 'alpha' ? 'ignore_case' : ''
    options.sort_order = getSort().isAscending ? 'asc' : 'desc'

    return CollectionsApi.query(collection + '/' + vmId + '/snapshots', options)
  }

  function getVm (vmId, refresh) {
    const options = {
      attributes: [
        'advanced_settings',
        'boot_time',
        'cloud',
        'compliances',
        'custom_attributes',
        'cpu_affinity',
        'created_on',
        'custom_actions',
        'custom_action_buttons',
        'disks',
        'disks_aligned',
        'drift_states',
        'ems_cluster',
        'ext_management_system',
        'evm_owner',
        'files',
        'guest_applications',
        'groups',
        'guid',
        'hardware',
        'host',
        'hostnames',
        'id',
        'ipaddresses',
        'kernel_drivers',
        'lans',
        'last_sync_on',
        'linux_initprocesses',
        'last_compliance_status',
        'miq_group',
        'miq_provision',
        'miq_provision_requests',
        'miq_provision_vms',
        'name',
        'num_disks',
        'parent_resource_pool',
        'power_state',
        'retired',
        'retires_on',
        'scan_histories',
        'service',
        'service.miq_request',
        'service_resources',
        'snapshots',
        'state_changed_on',
        'storages',
        'tags',
        'template',
        'thin_provisioned',
        'tools_status',
        'uid_ems',
        'users',
        'used_storage',
        'vendor',
        'v_total_snapshots',
        'vmsafe_enable',
        'cpu_usagemhz_rate_average_avg_over_time_period',
        'max_mem_usage_absolute_average_avg_over_time_period',
        'hardware.aggregate_cpu_speed',
        'allocated_disk_storage',
        'ram_size'
      ],
      expand: [],
      auto_refresh: refresh
    }

    return CollectionsApi.query(collection + '/' + vmId, options)
  }

  function setSort (currentField, isAscending) {
    sort.isAscending = isAscending
    sort.currentField = currentField
  }

  function getSort () {
    return sort
  }

  function setFilters (filterArray) {
    filters = filterArray
  }

  function getFilters () {
    return filters
  }

  function getPermissions () {
    return {
      start: RBAC.has(RBAC.FEATURES.VMS.START),
      stop: RBAC.has(RBAC.FEATURES.VMS.STOP),
      suspend: RBAC.has(RBAC.FEATURES.VMS.SUSPEND),
      tags: RBAC.has(RBAC.FEATURES.VMS.TAGS),
      snapshotsView: RBAC.has(RBAC.FEATURES.VMS.SNAPSHOTS.VIEW),
      snapshotsAdd: RBAC.has(RBAC.FEATURES.VMS.SNAPSHOTS.ADD),
      snapshotsDelete: RBAC.has(RBAC.FEATURES.VMS.SNAPSHOTS.DELETE),
      deleteAll: RBAC.hasAny(['vm_snapshot_delete_all']),
      revert: RBAC.hasAny(['vm_snapshot_revert']),
      retire: RBAC.has(RBAC.FEATURES.VMS.RETIRE)
    }
  }

  function deleteSnapshots (vmId, data) {
    const options = {
      'action': 'delete',
      'resources': data
    }

    return CollectionsApi.post(collection + '/' + vmId + '/snapshots/', null, {}, options)
  }

  function createSnapshots (vmId, data) {
    const options = {
      'action': 'create',
      'resources': [data]
    }

    return CollectionsApi.post(collection + '/' + vmId + '/snapshots/', null, {}, options)
  }

  function revertSnapshot (vmId, snapshotId) {
    const options = {
      'action': 'revert'
    }

    return CollectionsApi.post(collection + '/' + vmId + '/snapshots/' + snapshotId, null, {}, options)
  }

  function getInstance (vmId) {
    const options = {
      attributes: [
        'availability_zone',
        'cloud_networks',
        'cloud_subnets',
        'cloud_tenant',
        'cloud_volumes',
        'flavor',
        'floating_ip_addresses',
        'key_pairs',
        'load_balancers',
        'mac_addresses',
        'network_ports',
        'network_routers',
        'miq_provision_template',
        'orchestration_stack',
        'security_groups'
      ]
    }

    return CollectionsApi.get('instances', vmId, options)
  }

  // Private
  function getQueryFilters (filters) {
    const queryFilters = []

    filters.forEach((nextFilter) => {
      if (nextFilter.id === 'name' || nextFilter.id === 'description') {
        queryFilters.push(nextFilter.id + "='%" + nextFilter.value + "%'")
      } else {
        queryFilters.push(nextFilter.id + '=' + nextFilter.value)
      }
    })

    return queryFilters
  }
  function getLifeCycleCustomDropdown (retireFn, vmName) {
    let lifeCycleActions
    const clockIcon = 'fa fa-clock-o'
    const permissions = getPermissions()
    if (permissions.retire) {
      lifeCycleActions = {
        title: __('Lifecycle'),
        actionName: 'lifecycle',
        icon: 'fa fa-recycle',
        actions: [],
        isDisabled: false,
        tooltipText: __('Lifecycle')
      }
      const confirmationMessage = __('Are you sure you want to retire') + ` ${vmName} ` + __('now?')
      const lifecycleOptions = [
        {
          title: __('Retire'),
          name: __('Retire'),
          actionName: 'retireVM',
          actionFn: retireFn,
          icon: clockIcon,
          showConfirmation: true,
          confirmationMessage: confirmationMessage,
          confirmationTitle: __('Retire'),
          confirmationShowCancel: true,
          confirmationOkText: __('Retire'),
          confirmationOkStyle: 'primary',
          confirmationId: 'retireResourceConfirmId',
          permission: permissions.retire,
          isDisabled: false
        }
      ]
      lifeCycleActions.actions = checkMenuPermissions(lifecycleOptions)
    }

    return lifeCycleActions
  }

  function checkMenuPermissions (menuOptions) {
    const menu = []
    angular.forEach(menuOptions, (menuOption) => {
      if (menuOption.permission) {
        menu.push(menuOption)
      }
    })

    return menu
  }
}

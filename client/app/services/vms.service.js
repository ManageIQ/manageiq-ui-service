/* eslint camelcase: "off" */

/** @ngInject */
export function VmsService (CollectionsApi, RBAC, lodash) {
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
    getMetrics: getMetrics,
    getEvents: getEvents,
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

    return CollectionsApi.query(`${collection}/${vmId}/snapshots`, options)
  }

  function getVm (vmId, refresh) {
    const options = {
      attributes: [
        'advanced_settings',
        'archived',
        'boot_time',
        'cloud',
        'compliances',
        'cpu_affinity',
        'created_on',
        'custom_action_buttons',
        'custom_actions',
        'custom_attributes',
        'disks',
        'disks_aligned',
        'drift_states',
        'ems_cluster',
        'ems_id',
        'evm_owner',
        'ext_management_system',
        'files',
        'groups',
        'guest_applications',
        'guid',
        'hardware',
        'host',
        'hostnames',
        'id',
        'ipaddresses',
        'kernel_drivers',
        'lans',
        'last_compliance_status',
        'last_sync_on',
        'linux_initprocesses',
        'miq_group',
        'miq_provision',
        'miq_provision_requests',
        'miq_provision_vms',
        'name',
        'normalized_state',
        'num_disks',
        'orphaned',
        'parent_resource_pool',
        'power_state',
        'raw_power_state',
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
        'ram_size',
        'os_image_name'
      ],
      expand: [],
      auto_refresh: refresh
    }

    return CollectionsApi.query(`${collection}/${vmId}`, options)
  }

  function getSort () {
    return sort
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

  /**
   * This function handles GET request for vmID metric rollups
   * @function getMetrics
   * @param  {number} vmId - The vm id
   * @param  {object} options - an object containing overrides for required params, optional params: capture_interval, start_date, end_date
   * @return {promise} A promise containing metrics rollup data
   */
  function getMetrics (vmId, options = {}) {
    const today = new Date()
    const defaults = {
      capture_interval: 'daily',
      expand: 'resources',
      start_date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    }

    return CollectionsApi.get(`${collection}/${vmId}/metric_rollups`, '', Object.assign(defaults, options))
  }

  /**
   * This function handles GET request for vmID event stream, by default fetches all events of type: VmOrTemplate
   * for the current day
   * @function getEvents
   * @param  {number} vmId - The vm id
   * @param  {object} options - an object containing overrides for required params, optional params: event_type, target_id
   * @return {promise} A promise containing event stream data
   */
  function getEvents (vmId, options = {}) {
    const today = new Date()
    const yesterday = new Date(today.setDate(today.getDate() - 1))
    let filters = []
    const defaults = {
      target_id: vmId,
      target_type: 'VmOrTemplate',
      timestamp: `>${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`
    }
    Object.assign(defaults, options)
    lodash.forEach(defaults, (value, key) => {
      switch (key) {
        case 'timestamp':
          filters.push(`${key}${value}`)
          break
        default:
          filters.push(`${key}=${value}`)
      }
    })

    return CollectionsApi.query(`event_streams`, {
      expand: 'resources',
      filter: filters
    })
  }

  function setSort (currentField, isAscending) {
    sort.isAscending = isAscending
    sort.currentField = currentField
  }

  function setFilters (filterArray) {
    filters = filterArray
  }

  function deleteSnapshots (vmId, data) {
    const options = {
      'action': 'delete',
      'resources': data
    }

    return CollectionsApi.post(`${collection}/${vmId}/snapshots/`, null, {}, options)
  }

  function createSnapshots (vmId, data) {
    const options = {
      'action': 'create',
      'resources': [data]
    }

    return CollectionsApi.post(`${collection}/${vmId}/snapshots/`, null, {}, options)
  }

  function revertSnapshot (vmId, snapshotId) {
    const options = {
      'action': 'revert'
    }

    return CollectionsApi.post(collection + '/' + vmId + '/snapshots/' + snapshotId, null, {}, options)
  }

  // Private
  function getQueryFilters (filters) {
    const queryFilters = []

    filters.forEach((nextFilter) => {
      if (nextFilter.id === 'name' || nextFilter.id === 'description') {
        queryFilters.push(nextFilter.id + '=\'%' + nextFilter.value + '%\'')
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

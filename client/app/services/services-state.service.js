// eslint camelcase: "off"

/** @ngInject */
export function ServicesStateFactory (ListConfiguration, CollectionsApi, RBAC) {
  const permissions = getPermissions()
  const services = {}

  ListConfiguration.setupListFunctions(services, {id: 'name', title: __('Name'), sortType: 'alpha'})

  return {
    services: services,
    getService: getService,
    getServiceCredential: getServiceCredential,
    getServiceRepository: getServiceRepository,
    getServiceJobsStdout: getServiceJobsStdout,
    getServices: getServices,
    getServicesMinimal: getServicesMinimal,
    getPermissions: getPermissions,
    getLifeCycleCustomDropdown: getLifeCycleCustomDropdown,
    getPolicyCustomDropdown: getPolicyCustomDropdown,
    getConfigurationCustomDropdown: getConfigurationCustomDropdown
  }

  function getService (id, { isAutoRefresh = false, runAutomate = true } = {}) {
    const options = {
      attributes: [
        'actions',
        'aggregate_all_vm_disk_count',
        'aggregate_all_vm_disk_space_allocated',
        'aggregate_all_vm_disk_space_used',
        'aggregate_all_vm_memory',
        'aggregate_all_vm_memory_on_disk',
        'chargeback_report',
        'created_at',
        'custom_actions',
        'description',
        'evm_owner.name',
        'evm_owner.userid',
        'generic_objects.generic_object_definition',
        'generic_objects.picture',
        'guid',
        'miq_group.description',
        'name',
        'options',
        'parent_service',
        'picture',
        'picture.image_href',
        'power_state',
        'power_states',
        'power_status',
        runAutomate ? 'provision_dialog' : null,
        'retired',
        'retirement_state',
        'retirement_warn',
        'retires_on',
        'service_resources',
        'service_template',
        'type',
        'vms.cpu_usagemhz_rate_average_avg_over_time_period',
        'vms.archived',
        'vms.ems_id',
        'vms.hardware',
        'vms.hardware.aggregate_cpu_speed',
        'vms.ipaddresses',
        'vms.max_mem_usage_absolute_average_avg_over_time_period',
        'vms.normalized_state',
        'vms.orphaned',
        'vms.power_state',
        'vms.raw_power_state',
        'vms.retired',
        'vms.retires_on',
        'vms.snapshots',
        'vms.supported_consoles',
        'vms.v_snapshot_newest_name',
        'vms.v_snapshot_newest_timestamp',
        'vms.v_total_snapshots',
      ].filter((truthy) => truthy),
      expand: [
        'generic_objects',
        'orchestration_stacks',
        'vms',
      ],
      auto_refresh: isAutoRefresh,
    }

    return CollectionsApi.get('services', id, options)
  }

  function getServiceCredential (credentialId) {
    return CollectionsApi.get('authentications', credentialId, {})
  }

  function getServiceRepository (repositoryId) {
    return CollectionsApi.get('configuration_script_sources', repositoryId, {})
  }

  function getServiceJobsStdout (serviceId, stackId) {
    const options = {
      attributes: ['job_plays', 'stdout'],
      format_attributes: 'stdout=html'
    }

    return CollectionsApi.get(`services/${serviceId}/orchestration_stacks`, stackId, options)
  }

  // Returns minimal data for the services matching the current filters, useful for getting a filter count
  function getServicesMinimal (filters) {
    const options = {
      filter: getQueryFilters(filters)
    }

    return CollectionsApi.query('services', options)
  }

  function getServices (limit, offset, refresh) {
    const options = {
      expand: 'resources',
      limit: limit,
      offset: String(offset),
      attributes: [
        'all_service_children',
        'chargeback_report',
        'evm_owner.userid',
        'picture',
        'picture.image_href',
        'power_state',
        'power_states',
        'power_status',
        'retired',
        'retirement_state',
        'retirement_warn',
        'retires_on',
        'tags',
        'v_total_vms',
      ],
      filter: getQueryFilters(services.getFilters()),
      auto_refresh: refresh
    }

    options.sort_by = services.getSort().currentField.id || ''
    options.sort_options = services.getSort().currentField.sortType === 'alpha' ? 'ignore_case' : ''
    options.sort_order = services.getSort().isAscending ? 'asc' : 'desc'

    return CollectionsApi.query('services', options)
  }

  function getPermissions () {
    return {
      edit: RBAC.has(RBAC.FEATURES.SERVICES.EDIT),
      delete: RBAC.has(RBAC.FEATURES.SERVICES.DELETE),
      reconfigure: RBAC.hasAny(['service_admin', 'service_reconfigure']),
      setOwnership: RBAC.has(RBAC.FEATURES.SERVICES.OWNERSHIP),
      retire: RBAC.has(RBAC.FEATURES.SERVICES.RETIRE.RETIRE_NOW),
      setRetireDate: RBAC.has(RBAC.FEATURES.SERVICES.RETIRE.SET_DATE),
      editTags: RBAC.has(RBAC.FEATURES.SERVICES.TAGS),
      viewAnsible: RBAC.hasAny(['configuration_script_view', 'configuration_scripts_accord']),
      serviceStart: RBAC.has(RBAC.FEATURES.SERVICES.START),
      serviceStop: RBAC.has(RBAC.FEATURES.SERVICES.STOP),
      serviceSuspend: RBAC.has(RBAC.FEATURES.SERVICES.SUSPEND),
      instanceStart: RBAC.has(RBAC.FEATURES.VMS.START),
      instanceStop: RBAC.has(RBAC.FEATURES.VMS.STOP),
      instanceSuspend: RBAC.has(RBAC.FEATURES.VMS.SUSPEND),
      instanceRetire: RBAC.hasAny([RBAC.FEATURES.SERVICES.RETIRE.RETIRE_NOW, RBAC.FEATURES.SERVICES.RETIRE.SET_DATE]),
      cockpit: RBAC.has(RBAC.FEATURES.VMS.WEB_CONSOLE),
      html5_console: RBAC.has(RBAC.FEATURES.VMS.HTML5_CONSOLE),
      vmrc_console: RBAC.has(RBAC.FEATURES.VMS.VMRC_CONSOLE),
      viewSnapshots: RBAC.has(RBAC.FEATURES.VMS.SNAPSHOTS.VIEW),

      vm_snapshot_show_list: RBAC.has(RBAC.FEATURES.VMS.SNAPSHOTS.VIEW), // Display Lists of VM Snapshots
      vm_snapshot_add: RBAC.has(RBAC.FEATURES.VMS.SNAPSHOTS.ADD), // Create Snapshot
      ems_infra_show: RBAC.has('ems_infra_show'), // View Infrastructure Providers
      ems_cluster_show: RBAC.has('ems_cluster_show'), //  Display Individual Clusters
      host_show: RBAC.has('host_show'), // Display Individual Hosts
      resource_pool_show: RBAC.has('resource_pool_show'), // Display Individual Resource Pools
      storage_show_list: RBAC.has('storage_show_list'), // Display Lists of Datastores
      instance_show: RBAC.has('instance_show'), // Display Individual Instances related to a CI
      vm_drift: RBAC.has('vm_drift'), // Displays VMs Drift
      vm_check_compliance: RBAC.has('vm_check_compliance') // Check Compliance of Last Known Configuration
    }
  }

  function getLifeCycleCustomDropdown (setServiceRetirementFn, retireServiceFn) {
    let lifeCycleActions
    const clockIcon = 'fa fa-clock-o'

    if (permissions.retire || permissions.setRetireDate) {
      lifeCycleActions = {
        title: __('Lifecycle'),
        actionName: 'lifecycle',
        icon: 'fa fa-recycle',
        actions: [],
        isDisabled: false,
        tooltipText: __('Lifecycle')
      }
      const lifecycleOptions = [
        {
          icon: clockIcon,
          name: __('Set Retirement Dates'),
          actionName: 'setServiceRetirement',
          title: __('Set Retirement'),
          actionFn: setServiceRetirementFn,
          permission: permissions.setRetireDate,
          isDisabled: false
        },
        {
          title: __('Retire'),
          name: __('Retire'),
          actionName: 'retireService',
          actionFn: retireServiceFn,
          icon: clockIcon,
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

  function getPolicyCustomDropdown (editTagsFn) {
    let policyActions

    if (permissions.editTags) {
      policyActions = {
        title: __('Policy'),
        actionName: 'policy',
        icon: 'fa fa-shield',
        tooltipText: __('Policy'),
        actions: [
          {
            icon: 'pficon pficon-edit',
            name: __('Edit Tags'),
            actionName: 'editTags',
            title: __('Edit Tags'),
            actionFn: editTagsFn,
            isDisabled: false
          }
        ],
        isDisabled: false
      }
    }

    return policyActions
  }

  function getConfigurationCustomDropdown (editServiceFn, removeServicesFn, setOwnershipFn) {
    let configActions

    if (permissions.edit || permissions.delete || permissions.setOwnership) {
      configActions = {
        title: __('Configuration'),
        actionName: 'configuration',
        icon: 'fa fa-cog',
        actions: [],
        isDisabled: false,
        tooltipText: __('Configuration')
      }

      const configMenuOptions = [
        {
          icon: 'pficon pficon-edit',
          name: __('Edit'),
          actionName: 'edit',
          title: __('Edit'),
          actionFn: editServiceFn,
          isDisabled: false,
          permission: permissions.edit
        },
        {
          icon: 'pficon pficon-delete',
          name: __('Remove'),
          actionName: 'remove',
          title: __('Remove'),
          actionFn: removeServicesFn,
          isDisabled: false,
          showConfirmation: true,
          confirmationId: 'removeServiceConfirmId',
          confirmationTitle: __('Remove Service'),
          confirmationMessage: __('Confirm, would you like to remove this service?'),
          confirmationOkText: __('Yes, Remove Service'),
          confirmationOkStyle: 'primary',
          confirmationShowCancel: true,
          permission: permissions.delete
        },
        {
          icon: 'pficon pficon-user',
          name: __('Set Ownership'),
          actionName: 'ownership',
          title: __('Set Ownership'),
          actionFn: setOwnershipFn,
          isDisabled: false,
          permission: permissions.setOwnership
        }
      ]
      configActions.actions = checkMenuPermissions(configMenuOptions)
    }

    return configActions
  }

  // Private
  function getQueryFilters (filters = []) {
    const queryFilters = ['ancestry=null', 'display=true']

    filters.forEach((nextFilter) => {
      if (nextFilter.id === 'name') {
        queryFilters.push(`name='%${nextFilter.value}%'`)
      } else if (nextFilter.id === 'tags.name') {
        const tagValue = nextFilter.value
        queryFilters.push(`${nextFilter.id}=${tagValue.filterCategory.id}${tagValue.filterDelimiter}${tagValue.filterValue.id}`)
      } else if (angular.isDefined(nextFilter.operator)) {
        if (nextFilter.value.id) {
          queryFilters.push(`${nextFilter.id}${nextFilter.operator}${nextFilter.value.id}`)
        } else {
          queryFilters.push(`${nextFilter.id}${nextFilter.operator}${nextFilter.value}`)
        }
      } else if (angular.isDefined(nextFilter.value.id)) {
        queryFilters.push(`${nextFilter.id}=${nextFilter.value.id}`)
      } else {
        queryFilters.push(`${nextFilter.id}=${nextFilter.value}`)
      }
    })

    return queryFilters
  }
}

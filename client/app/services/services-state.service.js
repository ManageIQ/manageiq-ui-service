/* eslint camelcase: "off" */

/** @ngInject */
export function ServicesStateFactory(ListConfiguration, CollectionsApi, RBAC) {
  const actionFeatures = RBAC.getActionFeatures();
  const services = {};

  ListConfiguration.setupListFunctions(services, {id: 'name', title: __('Name'), sortType: 'alpha'});

  return {
    services: services,
    getService: getService,
    getServiceCredential: getServiceCredential,
    getServices: getServices,
    getServicesMinimal: getServicesMinimal,
    getLifeCycleCustomDropdown: getLifeCycleCustomDropdown,
    getPolicyCustomDropdown: getPolicyCustomDropdown,
    getConfigurationCustomDropdown: getConfigurationCustomDropdown,
  };

  function getService(id) {
    const options = {
      attributes: [
        'name', 'guid', 'created_at', 'type', 'description', 'picture', 'picture.image_href', 'evm_owner.name', 'evm_owner.userid',
        'miq_group.description', 'all_service_children', 'aggregate_all_vm_cpus', 'aggregate_all_vm_memory', 'aggregate_all_vm_disk_count',
        'aggregate_all_vm_disk_space_allocated', 'aggregate_all_vm_disk_space_used', 'aggregate_all_vm_memory_on_disk', 'retired',
        'retirement_state', 'retirement_warn', 'retires_on', 'actions', 'custom_actions', 'provision_dialog', 'service_resources',
        'chargeback_report', 'service_template', 'parent_service', 'power_state', 'power_status', 'options', 'orchestration_stacks',
      ],
      decorators: [
        'vms.ipaddresses',
        'vms.snapshots',
        'vms.v_total_snapshots',
        'vms.v_snapshot_newest_name',
        'vms.v_snapshot_newest_timestamp',
        'vms.v_snapshot_newest_total_size',
        'vms.supports_console?',
        'vms.supports_cockpit?'],
      expand: 'vms',
    };

    return CollectionsApi.get('services', id, options);
  }

  function getServiceCredential(credentialId) {
    return CollectionsApi.get('authentications', credentialId, {});
  }

  // Returns minimal data for the services matching the current filters, useful for getting a filter count
  function getServicesMinimal(filters) {
    const options = {
      filter: getQueryFilters(filters),
    };

    return CollectionsApi.query('services', options);
  }

  function getServices(limit, offset, filters, sortField, sortAscending) {
    const options = {
      expand: 'resources',
      limit: limit,
      offset: String(offset),
      attributes: [
        'picture',
        'picture.image_href',
        'chargeback_report',
        'evm_owner.userid',
        'miq_group.description',
        'v_total_vms',
        'power_state',
        'power_states',
        'power_status',
        'all_service_children',
        'all_vms',
        'custom_actions',
        'service_resources',
      ],
      filter: getQueryFilters(filters),
    };

    if (angular.isDefined(sortField)) {
      options.sort_by = services.getSort().currentField.id;
      options.sort_options = services.getSort().currentField.sortType === 'alpha' ? 'ignore_case' : '';
      options.sort_order = sortAscending ? 'asc' : 'desc';
    }

    return CollectionsApi.query('services', options);
  }

  function getLifeCycleCustomDropdown(setServiceRetirementFn, retireServiceFn) {
    let lifeCycleActions;
    const clockIcon = 'fa fa-clock-o';

    if (actionFeatures.serviceRetireNow.show || actionFeatures.serviceRetire.show) {
      lifeCycleActions = {
        title: __('Lifecycle'),
        actionName: 'lifecycle',
        icon: 'fa fa-recycle',
        actions: [],
        isDisabled: false,
      };
      if (actionFeatures.serviceRetire.show) {
        lifeCycleActions.actions.push(
          {
            icon: clockIcon,
            name: __('Set Retirement Dates'),
            actionName: 'setServiceRetirement',
            title: __('Set Retirement'),
            actionFn: setServiceRetirementFn,
            isDisabled: false,
          }
        );
      }
      if (actionFeatures.serviceRetireNow.show) {
        lifeCycleActions.actions.push(
          {
            title: __('Retire'),
            name: __('Retire'),
            actionName: 'retireService',
            actionFn: retireServiceFn,
            icon: clockIcon,
            showConfirmation: true,
            confirmationMessage: __('Confirm, would you like to retire this service?'),
            confirmationTitle: __('Retire Service Now'),
            confirmationShowCancel: true,
            confirmationOkText: __('Yes, Retire Service Now'),
            confirmationOkStyle: 'primary',
            confirmationId: 'retireServiceConfirmId',
            isDisabled: false,
          }
        );
      }
    }

    return lifeCycleActions;
  }

  function getPolicyCustomDropdown(editTagsFn) {
    let policyActions;

    if (actionFeatures.serviceTag.show) {
      policyActions = {
        title: __('Policy'),
        actionName: 'policy',
        icon: 'fa fa-shield',
        actions: [
          {
            icon: 'pficon pficon-edit',
            name: __('Edit Tags'),
            actionName: 'editTags',
            title: __('Edit Tags'),
            actionFn: editTagsFn,
            isDisabled: false,
          },
        ],
        isDisabled: false,
      };
    }

    return policyActions;
  }

  function getConfigurationCustomDropdown(editServiceFn, removeServicesFn, setOwnershipFn) {
    let configActions;

    if (actionFeatures.serviceDelete.show
      || actionFeatures.serviceEdit.show
      || actionFeatures.serviceOwnership.show) {
      configActions = {
        title: __('Configuration'),
        actionName: 'configuration',
        icon: 'fa fa-cog',
        actions: [],
        isDisabled: false,
      };

      if (actionFeatures.serviceEdit.show) {
        configActions.actions.push(
          {
            icon: 'pficon pficon-edit',
            name: __('Edit'),
            actionName: 'edit',
            title: __('Edit'),
            actionFn: editServiceFn,
            isDisabled: false,
          }
        );
      }

      if (actionFeatures.serviceDelete.show) {
        configActions.actions.push(
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
          }
        );
      }

      if (actionFeatures.serviceOwnership.show) {
        configActions.actions.push(
          {
            icon: 'pficon pficon-user',
            name: __('Set Ownership'),
            actionName: 'ownership',
            title: __('Set Ownership'),
            actionFn: setOwnershipFn,
            isDisabled: false,
          }
        );
      }
    }

    return configActions;
  }

  // Private
  function getQueryFilters(filters) {
    const queryFilters = ['ancestry=null'];

    angular.forEach(filters, function(nextFilter) {
      if (nextFilter.id === 'name') {
        queryFilters.push("name='%" + nextFilter.value + "%'");
      } else {
        if (angular.isDefined(nextFilter.operator)) {
          queryFilters.push(nextFilter.id + nextFilter.operator + nextFilter.value);
        } else {
          queryFilters.push(nextFilter.id + '=' + nextFilter.value);
        }
      }
    });

    return queryFilters;
  }
}

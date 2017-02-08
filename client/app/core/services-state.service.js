/* eslint camelcase: "off" */

/** @ngInject */
export function ServicesStateFactory(ListConfiguration, CollectionsApi, RBAC) {
  var service = {};
  var actionFeatures = RBAC.getActionFeatures();

  ListConfiguration.setupListFunctions(service, { id: 'name', title: __('Name'), sortType: 'alpha' });

  // Returns minimal data for the services matching the current filters, useful for getting a filter count
  service.getServicesMinimal = function(filters) {
    var options = {
      filter: getQueryFilters(filters),
    };

    return CollectionsApi.query('services', options);
  };

  service.getServices = function(limit, offset, filters, sortField, sortAscending) {
    var options = {
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
        'tags'],
      filter: getQueryFilters(filters),
    };

    if (angular.isDefined(sortField)) {
      options.sort_by = service.getSort().currentField.id;
      options.sort_options = service.getSort().currentField.sortType === 'alpha' ? 'ignore_case' : '';
      options.sort_order = sortAscending ? 'asc' : 'desc';
    }

    return CollectionsApi.query('services', options);
  };

  service.getLifeCycleCustomDropdown = function(setServiceRetirementFn, retireServiceFn) {
    var lifeCycleActions;
    var clockIcon = 'fa fa-clock-o';

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
  };

  service.getPolicyCustomDropdown = function(editTagsFn) {
    var policyActions;

    if (actionFeatures.serviceTag.show) {
      policyActions =           {
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
  };

  service.getConfigurationCustomDropdown = function(editServiceFn, removeServicesFn, setOwnershipFn) {
    var configActions;

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
  };

  function getQueryFilters(filters) {
    var queryFilters =  ['ancestry=null'];

    angular.forEach(filters, function(nextFilter) {
      if (nextFilter.id === 'name') {
        queryFilters.push("name='%" + nextFilter.value + "%'");
      } else {
        if (angular.isDefined(nextFilter.operator)) {
          queryFilters.push(nextFilter.id + nextFilter.operator + nextFilter.value );
        } else {
          queryFilters.push(nextFilter.id + '=' + nextFilter.value );
        }
      }
    });

    return queryFilters;
  }

  return service;
}

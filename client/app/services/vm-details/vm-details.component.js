/* eslint camelcase: "off" */
import './_vm-details.sass';
import templateUrl from './vm-details.html';

export const VmDetailsComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  templateUrl,
};

/** @ngInject */
function ComponentController($stateParams, VmsService, ServicesState, sprintf, EventNotifications, Polling, PowerOperations, LONG_POLLING_INTERVAL) {
  const vm = this;
  vm.$onInit = activate;
  vm.$onDestroy = onDestroy;

  function onDestroy() {
    Polling.stop('polling');
  }

  function activate() {
    vm.permissions = ServicesState.getPermissions();
    angular.extend(vm, {
      hasCustomButtons: hasCustomButtons,
      loading: true,
      neverText: __('Never'),
      noneText: __('None'),
      availableText: __('Available'),
      notAvailable: __("Not Available"),
      vmDetails: {},
      instance: {},
      // Config
      headerConfig: {
        actionsConfig: {
          actionsInclude: true,
        },
      },
    });
    resolveData();
    Polling.start('polling', resolveData, LONG_POLLING_INTERVAL);
  }

// Private
  function startVM() {
    PowerOperations.startVm(vm.vmDetails);
  }

  function stopVM() {
    PowerOperations.stopVm(vm.vmDetails);
  }

  function suspendVM() {
    PowerOperations.suspendVm(vm.vmDetails);
  }

  function retireVM() {
    PowerOperations.retireVM(vm.vmDetails);
  }

  function resolveData() {
    VmsService.getVm($stateParams.vmId).then(handleSuccess, handleFailure);

    function handleSuccess(response) {
      if (response.cloud) {
        VmsService.getInstance(response.id).then((response) => {
          vm.instance = response;
          processInstanceVariables(vm.instance);
        });
      }
      vm.vmDetails = response;
      vm.vmDetails.lastSyncOn = (angular.isUndefined(vm.vmDetails.last_sync_on) ? vm.neverText : vm.vmDetails.last_sync_on);
      vm.vmDetails.retiresOn = (angular.isUndefined(vm.vmDetails.retires_on) ? vm.neverText : vm.vmDetails.retires_on);
      vm.vmDetails.snapshotCount = defaultText(vm.vmDetails.snapshots);
      vm.vmDetails.resourceAvailability = (vm.vmDetails.template === false ? vm.availableText : vm.noneText);
      vm.vmDetails.driftHistory = defaultText(vm.vmDetails.drift_states);
      vm.vmDetails.scanHistoryCount = defaultText(vm.vmDetails.scan_histories);
      vm.vmDetails.lastComplianceStatus = (angular.isUndefined(vm.vmDetails.last_compliance_status) ? __('Never Verified') : vm.vmDetails.last_compliance_status);
      vm.vmDetails.complianceHistory = (vm.vmDetails.compliances.length > 0 ? vm.availableText : vm.notAvailable);
      vm.vmDetails.provisionDate = angular.isDefined(vm.vmDetails.service.miq_request) ? vm.vmDetails.service.miq_request.fulfilled_on : __('Unknown');
      vm.vmDetails.containerSpecsText = vm.vmDetails.vendor + ': ' + vm.vmDetails.hardware.cpu_total_cores + ' CPUs (' + vm.vmDetails.hardware.cpu_sockets
        + ' sockets x ' + vm.vmDetails.hardware.cpu_cores_per_socket + ' core), ' + vm.vmDetails.hardware.memory_mb + ' MB';

      if (vm.vmDetails.retired) {
        EventNotifications.clearAll(EventNotifications.state().groups[0]);
        EventNotifications.warn(sprintf(__("%s is a retired resource"), vm.vmDetails.name), {persistent: true, unread: false});
      }
      getListActions();
      hasCustomButtons();
      vm.loading = false;
    }

    function handleFailure(_error) {
      EventNotifications.error(__('There was an error loading the vm details.'));
    }
  }

  function hasCustomButtons() {
    const actions = vm.vmDetails.custom_actions || {};
    const groups = actions.button_groups || [];
    const buttons = [].concat(actions.buttons, ...groups.map((g) => g.buttons));
   
    return lodash.compact(buttons).length > 0;
  }

  function getListActions() {
    vm.listActions = [];
    const powerOptionsMenu = {
      title: __('Power Operations'),
      name: __('Power'),
      actionName: 'powerOperations',
      icon: 'fa fa-power-off',
      actions: [],
      isDisabled: false,
    };
    const powerOptionsActions = [
      {
        icon: 'fa fa-play',
        name: __('Start'),
        actionName: 'start',
        title: __('Start the Service'),
        actionFn: startVM,
        permission: vm.permissions.instanceStart,
        isDisabled: vm.vmDetails.power_state === 'on',
      }, {
        icon: 'fa fa-stop',
        name: __('Stop'),
        actionName: 'stop',
        title: __('Stop the Service'),
        actionFn: stopVM,
        permission: vm.permissions.instanceStop,
        isDisabled: vm.vmDetails.power_state !== 'on',
      }, {
        icon: 'fa fa-pause',
        name: __('Suspend'),
        actionName: 'suspend',
        title: __('Suspend the Service'),
        actionFn: suspendVM,
        permission: vm.permissions.instanceSuspend,
        isDisabled: vm.vmDetails.power_state !== 'on',
      }, {
        icon: 'fa fa-clock-o',
        name: __('Retire'),
        actionName: 'retire',
        title: __('Retire the Service'),
        actionFn: retireVM,
        permission: vm.permissions.instanceRetire,
        isDisabled: vm.vmDetails.power_state !== 'on',

      },
    ];
    powerOptionsActions.forEach((menuOption) => {
      menuOption.permission ? powerOptionsMenu.actions.push(menuOption) : false;
    });
    powerOptionsMenu.actions.length ? vm.listActions.push(powerOptionsMenu) : false;
  }


  function defaultText(inputCount, defaultText) {
    const inputArrSize = inputCount.length;
    defaultText = (defaultText === null ? 'None' : defaultText);
    if (inputArrSize === 0) {
      return __(defaultText);
    } else {
      return inputArrSize;
    }
  }


  function processInstanceVariables(data) {
    data.availabilityZone = (angular.isUndefined(data.availability_zone) ? vm.noneText : data.availability_zone.name);
    data.cloudTenant = (angular.isUndefined(data.cloud_tenant) ? vm.noneText : data.cloud_tenant);
    data.orchestrationStack = ( angular.isUndefined(data.orchestration_stack) ? vm.noneText : data.orchestration_stack);
    data.keyPairLabels = [];
    data.key_pairs.forEach(function(keyPair) {
      data.keyPairLabels.push(keyPair.name);
    });

    vm.vmDetails.instance = data;
  }
}

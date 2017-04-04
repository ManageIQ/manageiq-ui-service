/* eslint camelcase: "off" */
import './_vm-details.sass';
import templateUrl from './vm-details.html';

export const VmDetailsComponent = {
  templateUrl,
  controller: ComponentController,
  controllerAs: 'vm',
  bindToController: true,
};

/** @ngInject */
function ComponentController($stateParams, VmsService, sprintf, EventNotifications) {
  const vm = this;

  vm.$onInit = function() {
    vm.permissions = VmsService.getPermissions();

    angular.extend(vm, {
      vmDetails: {},
      instance: {},
      loading: false,
    });

    resolveData();
  };


  // Private
  function processInstanceVariables(data) {
    const noneText = __('None');
    data.availabilityZone = (angular.isUndefined(data.availability_zone) ? noneText : data.availability_zone.name);
    data.cloudTenant = (angular.isUndefined(data.cloud_tenant) ? noneText : data.cloud_tenant);
    data.orchestrationStack = ( angular.isUndefined(data.orchestration_stack) ? noneText : data.orchestration_stack);
    data.keyPairLabels = [];
    data.key_pairs.forEach(function(keyPair) {
      data.keyPairLabels.push(keyPair.name);
    });

    vm.vmDetails.instance = data;
  }

  function resolveData() {
    VmsService.getVm($stateParams.vmId).then(handleSuccess, handleFailure);

    function handleSuccess(response) {
      const neverText = __('Never');
      const noneText = __('None');
      const availableText = __('Available');
      const notAvailable = __("Not Available");


      if (response.cloud) {
        VmsService.getInstance(response.id).then((response) => {
          vm.instance = response;
        });
      }

      vm.vmDetails = response;

      vm.vmDetails.lastSyncOn = (angular.isUndefined(vm.vmDetails.last_sync_on) ? neverText : vm.vmDetails.last_sync_on);
      vm.vmDetails.retiresOn = (angular.isUndefined(vm.vmDetails.retires_on) ? neverText : vm.vmDetails.retires_on);
      vm.vmDetails.snapshotCount = defaultText(vm.vmDetails.snapshots);
      vm.vmDetails.resourceAvailability = (vm.vmDetails.template === false ? availableText : noneText);
      vm.vmDetails.driftHistory = defaultText(vm.vmDetails.drift_states);
      vm.vmDetails.scanHistoryCount = defaultText(vm.vmDetails.scan_histories);
      vm.vmDetails.lastComplianceStatus = (angular.isUndefined(vm.vmDetails.last_compliance_status) ? __('Never Verified') : vm.vmDetails.last_compliance_status);
      vm.vmDetails.complianceHistory = (vm.vmDetails.compliances.length > 0 ? availableText : notAvailable);
      vm.vmDetails.provisionDate = angular.isDefined(vm.vmDetails.service.miq_request) ? vm.vmDetails.service.miq_request.fulfilled_on : __('Unknown');
      vm.vmDetails.containerSpecsText = vm.vmDetails.vendor + ': ' + vm.vmDetails.hardware.cpu_total_cores + ' CPUs (' + vm.vmDetails.hardware.cpu_sockets
        + ' sockets x ' + vm.vmDetails.hardware.cpu_cores_per_socket + ' core), ' + vm.vmDetails.hardware.memory_mb + ' MB';

      if (vm.vmDetails.cloud) {
        processInstanceVariables(vm.instance);
      }
      if (vm.vmDetails.retired) {
        EventNotifications.warn(sprintf(__("%s is a retired resource"), vm.vmDetails.name), {persistent: true, unread: false});
      }
    }

    function handleFailure(_error) {
      EventNotifications.error(__('There was an error loading the vm details.'));
    }
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
}

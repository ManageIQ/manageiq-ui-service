import templateUrl from './details.html';

/** @ngInject */
export function VmsDetailsState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'vms.details': {
      url: '/:vmId',
      templateUrl,
      controller: StateController,
      controllerAs: 'vm',
      title: N_('VM Details'),
      resolve: {
        vmDetails: resolveVM,
        service: resolveService,
        instance: resolveInstance,
      },
    },
  };
}

/** @ngInject */
function resolveVM($stateParams, CollectionsApi) {
  var requestAttributes = [
    'advanced_settings',
    'boot_time',
    'cloud',
    'compliances',
    'cpu_affinity',
    'created_on',
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
    'vendor',
    'vmsafe_enable',
  ];
  var options = {
    attributes: requestAttributes,
  };

  return CollectionsApi.get('vms', $stateParams.vmId, options);
}
/** @ngInject */
function resolveService(CollectionsApi, vmDetails) {
  var options = {
    attributes: ['miq_request'],
  };

  return CollectionsApi.get('services', vmDetails.service.id, options);
}
/** @ngInject */
function resolveInstance(CollectionsApi, vmDetails) {
  var requestAttributes = [
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
    'security_groups',
  ];
  var options = {
    attributes: requestAttributes,
  };
  if (vmDetails.cloud === true) {
    return CollectionsApi.get('instances', vmDetails.id, options);
  } else {
    return false;
  }
}
/** @ngInject */
function StateController(service, vmDetails, instance, EventNotifications, sprintf) {
  var vm = this;


  vm.vmDetails = vmDetails;

  activate();
  function activate() {
    var neverText = __('Never');
    var noneText = __('None');
    var availableText = __('Available');
    var notAvailable = __("Not Available");
    vm.vmDetails.lastSyncOn = (angular.isUndefined(vm.vmDetails.last_sync_on) ? neverText : vm.vmDetails.last_sync_on);
    vm.vmDetails.retiresOn = (angular.isUndefined(vm.vmDetails.retires_on) ? neverText : vm.vmDetails.retires_on);
    vm.vmDetails.snapshotCount = defaultText(vm.vmDetails.snapshots);
    vm.vmDetails.resourceAvailability = (vm.vmDetails.template === false ? availableText : noneText);
    vm.vmDetails.driftHistory = defaultText(vm.vmDetails.drift_states);
    vm.vmDetails.scanHistoryCount = defaultText(vm.vmDetails.scan_histories);
    vm.vmDetails.lastComplianceStatus = (angular.isUndefined(vm.vmDetails.last_compliance_status) ? __('Never Verified') : vm.vmDetails.last_compliance_status);
    vm.vmDetails.complianceHistory = (vm.vmDetails.compliances.length > 0 ? availableText : notAvailable);
    vm.vmDetails.provisionDate = angular.isDefined(service.miq_request) ? service.miq_request.fulfilled_on : __('Unknown');
    vm.vmDetails.containerSpecsText = vm.vmDetails.vendor + ': ' + vm.vmDetails.hardware.cpu_total_cores + ' CPUs (' + vm.vmDetails.hardware.cpu_sockets
      + ' sockets x ' + vm.vmDetails.hardware.cpu_cores_per_socket + ' core), ' + vm.vmDetails.hardware.memory_mb + ' MB';

    if (instance !== false) {
      processInstanceVariables(instance);
    }
    if (vm.vmDetails.retired) {
      EventNotifications.warn(sprintf(__("%s is a retired resource"), vm.vmDetails.name), {persistent: true, unread: false});
    }
  }

  function defaultText(inputCount, defaultText) {
    var inputArrSize = inputCount.length;
    defaultText = (defaultText === null ? 'None' : defaultText);
    if (inputArrSize === 0) {
      return __(defaultText);
    } else {
      return inputArrSize;
    }
  }

  function processInstanceVariables(data) {
    var noneText = __('None');
    data.availabilityZone = (angular.isUndefined(data.availability_zone) ? noneText : data.availability_zone.name);
    data.cloudTenant = (angular.isUndefined(data.cloud_tenant) ? noneText : data.cloud_tenant);
    data.orchestrationStack = ( angular.isUndefined(data.orchestration_stack) ? noneText : data.orchestration_stack);
    data.keyPairLabels = [];
    data.key_pairs.forEach(function(keyPair) {
      data.keyPairLabels.push(keyPair.name);
    });

    vm.vmDetails.instance = data;
  }
}

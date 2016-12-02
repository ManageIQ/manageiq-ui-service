(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'vms.details': {
        url: '/:vmId',
        templateUrl: 'app/states/vms/details/details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('VM Details'),
        resolve: {
          vmDetails: resolveVM,
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
      "hardware",
      'host',
      'hostnames',
      'id',
      'ipaddresses',
      "kernel_drivers",
      "lans",
      'last_sync_on',
      'linux_initprocesses',
      'last_compliance_status',
      "miq_group",
      "miq_provision",
      "miq_provision_requests",
      "miq_provision_vms",
      'name',
      'num_disks',
      'parent_resource_pool',
      'power_state',
      'retires_on',
      'scan_histories',
      "service",
      "service_resources",
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
  function StateController($state, vmDetails, CollectionsApi, EventNotifications, Consoles) {
    var vm = this;
  
    vm.vmDetails = vmDetails;
    setInitialVars();

    function setInitialVars() {
      if (vm.vmDetails.cloud === true) {
        resolveInstance(vm.vmDetails.id);
      }

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
      var options = {
        attributes: ['miq_request'],
      };
      CollectionsApi.get('services', vmDetails.service.id, options).then(serviceSuccess, {});
    }
    function defaultText(inputCount, defaultText = 'None') {
      var inputArrSize = inputCount.length;
      if (inputArrSize === 0) {
        return __(defaultText);
      } else {
        return inputArrSize;
      }
    }
    function serviceSuccess(data) {
      vm.vmDetails.provisionDate = data.miq_request.fulfilled_on;
    }
    function resolveInstance(instanceId) {
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

      CollectionsApi.get('instances', instanceId, options).then(processInstanceVariables, {});
    }
    function processInstanceVariables(data) {
      var noneText = __('None');
      data.availabilityZone = (angular.isUndefined(data.availability_zone) ? noneText : data.availability_zone.name);
      data.cloudTenant = (angular.isUndefined(data.cloud_tenant) ? noneText : data.cloud_tenant);
      data.orchestrationStack = ( angular.isUndefined(data.orchestration_stack) ? noneText :  data.orchestration_stack);
      data.keyPairLabels = [];
      data.key_pairs.forEach( function(keyPair) {
        data.keyPairLabels.push(keyPair.name);
      });
      
      vm.vmDetails.instance = data;
    }
  }
})();

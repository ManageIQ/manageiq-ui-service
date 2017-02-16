/* eslint camelcase: "off" */

/** @ngInject */
export function ServicesDetailsState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'services.details': {
      url: '/:serviceId',
      templateUrl: 'app/states/services/details/details.html',
      controller: StateController,
      controllerAs: 'vm',
      title: N_('Service Details'),
      resolve: {
        service: resolveService,
        tags: resolveTags,
      },
    },
  };
}

/** @ngInject */
function resolveService($stateParams, CollectionsApi) {
  var requestAttributes = [
    'description',
    'picture',
    'picture.image_href',
    'evm_owner.name',
    'evm_owner.userid',
    'miq_group.description',
    'all_service_children',
    'all_vms',
    'aggregate_all_vm_cpus',
    'aggregate_all_vm_memory',
    'aggregate_all_vm_disk_count',
    'aggregate_all_vm_disk_space_allocated',
    'aggregate_all_vm_disk_space_used',
    'aggregate_all_vm_memory_on_disk',
    "retired",
    "retirement_state",
    "retirement_warn",
    "retires_on",
    'actions',
    'custom_actions',
    'provision_dialog',
    'service_template',
    'service_resources',
    'chargeback_report',
    'parent_service',
    'power_state',
    'power_status',
    'created_at',
    'options',
    'name',
    'guid',
    'vms.ipaddresses',
  ];
  var options = {
    attributes: requestAttributes,
    decorators: ['vms.snapshots',     
      'vms.v_total_snapshots',
      'vms.v_snapshot_newest_name',
      'vms.v_snapshot_newest_timestamp',
      'vms.v_snapshot_newest_total_size',
      'vms.supports_console?',
      'vms.supports_cockpit?'],
    expand: 'vms',
  };

  return CollectionsApi.get('services', $stateParams.serviceId, options);
}

/** @ngInject */
function resolveTags($stateParams, taggingService) {
  var serviceUrl = 'services/' + $stateParams.serviceId + '/tags/';

  return taggingService.queryAvailableTags(serviceUrl);
}

/** @ngInject */
function StateController($scope, $stateParams, service, tags, CollectionsApi, Polling, taggingService) {
  var vm = this;
  vm.service = service;
  vm.tags = tags;
  vm.pollingInterval = 10000;

  Polling.start('servicesPolling', startPollingService, vm.pollingInterval);
  $scope.$on('$destroy', function () {
    Polling.stop('servicesPolling');
  });
  
  function startPollingService() {
    resolveService($stateParams, CollectionsApi).then(function (data) {
      vm.service = data;
    });
    resolveTags($stateParams, taggingService).then(function (data) {
      vm.tags = data;
    });
  }
}

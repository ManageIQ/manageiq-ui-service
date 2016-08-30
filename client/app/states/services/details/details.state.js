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
      'services.details': {
        url: '/:serviceId',
        templateUrl: 'app/states/services/details/details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('Service Details'),
        resolve: {
          service: resolveService
        }
      }
    };
  }

  /** @ngInject */
  function resolveService($stateParams, CollectionsApi) {
    var requestAttributes = [
      'picture',
      'picture.image_href',
      'evm_owner.name',
      'miq_group.description',
      'aggregate_all_vm_cpus',
      'aggregate_all_vm_memory',
      'aggregate_all_vm_disk_count',
      'aggregate_all_vm_disk_space_allocated',
      'aggregate_all_vm_disk_space_used',
      'aggregate_all_vm_memory_on_disk',
      'actions',
      'custom_actions',
      'provision_dialog',
      'service_template'
    ];
    var options = {
      attributes: requestAttributes,
      decorators: [ 'vms.supports_console?', 'vms.supports_cockpit?' ],
      expand: 'vms',
    };

    return CollectionsApi.get('services', $stateParams.serviceId, options);
  }

  /** @ngInject */
  function StateController($state, service, CollectionsApi, EditServiceModal, RetireServiceModal, OwnershipServiceModal, Notifications, jQuery, Consoles) {
    var vm = this;
    setInitialVars(vm);

    if (!angular.isDefined(vm.service.vms)) {
      vm.vms = [];
    } else {
      vm.vms = vm.service.vms;
    }

    var actions = vm.service.actions;
    if (actions !== undefined) {
      for (var i = 0; i < actions.length; i++) {
        if (actions[i].name === "reconfigure") {
          vm.service.reconfigure = true;
        }
      }
    }

    function reconfigureService(service) {
      $state.go('services.reconfigure', {serviceId: service});
    }

    vm.listConfig = {
      selectItems: false,
      showSelectBox: false,
      onClick: maybeOpenConsole,
    };

    activate();

    function activate() {
    }

    function setInitialVars(vm) {
      vm.showRemoveService = $state.actionFeatures.service_delete.show;
      vm.showRetireService = $state.actionFeatures.service_retire_now.show;
      vm.showScheduleRetirementService = $state.actionFeatures.service_retire.show;
      vm.showEditService = $state.actionFeatures.service_edit.show;
      vm.showReconfigureService = $state.actionFeatures.service_reconfigure.show;
      vm.showSetOwnership = $state.actionFeatures.service_ownership.show;

      vm.title = __('Service Details');
      vm.service = service;

      vm.activate = activate;
      vm.removeService = removeService;
      vm.editServiceModal = editServiceModal;
      vm.retireServiceNow = retireServiceNow;
      vm.retireServiceLater = retireServiceLater;
      vm.ownershipServiceModal = ownershipServiceModal;
      vm.reconfigureService = reconfigureService;
    }

    function removeService() {
      var removeAction = {action: 'retire'};
      CollectionsApi.post('services', vm.service.id, {}, removeAction).then(removeSuccess, removeFailure);

      function removeSuccess() {
        Notifications.success(vm.service.name + __(' was removed.'));
        $state.go('services.list');
      }

      function removeFailure(data) {
        Notifications.error(__('There was an error removing this service.'));
      }
    }

    /*
      FIXME
      this is a hack because it's impossible to access the current scope inside of
      pf-list-view, and pf-list-view's actionButtons doesn't support hiding buttons
      based on a condition
      so the button gets .open-console-button instead of ng-click="vm.openConsole(item)"
      and we're abusing onClick to verify the event came from that button and call
      openConsole if so
     */
    function maybeOpenConsole(item, event) {
      var $target = jQuery(event.target);

      if ($target.is('.open-console-button') || $target.is('.open-console-button *')) {
        Consoles.open(item.id);
      }
    }

    function editServiceModal() {
      EditServiceModal.showModal(vm.service);
    }

    function ownershipServiceModal() {
      OwnershipServiceModal.showModal(vm.service);
    }

    function retireServiceNow() {
      var data = {action: 'retire'};
      CollectionsApi.post('services', vm.service.id, {}, data).then(retireSuccess, retireFailure);

      function retireSuccess() {
        Notifications.success(vm.service.name + __(' was retired.'));
        $state.go('services.list');
      }

      function retireFailure() {
        Notifications.error(__('There was an error retiring this service.'));
      }
    }

    function retireServiceLater() {
      RetireServiceModal.showModal(vm.service);
    }
  }
})();

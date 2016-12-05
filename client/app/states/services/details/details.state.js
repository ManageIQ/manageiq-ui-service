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
          service: resolveService,
          tags: resolveTags,
        },
      },
    };
  }

  /** @ngInject */
  function resolveService($stateParams, CollectionsApi) {
    var requestAttributes = [
      'picture',
      'picture.image_href',
      'evm_owner.name',
      'evm_owner.userid',
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
      'service_template',
      'chargeback_report',
      'power_state',
      'created_at',
      'options',
      'name',
      'guid',
    ];
    var options = {
      attributes: requestAttributes,
      decorators: [ 'vms.supports_console?', 'vms.supports_cockpit?' ],
      expand: 'vms',
    };

    return CollectionsApi.get('services', $stateParams.serviceId, options);
  }
  function resolveTags($stateParams, CollectionsApi) {
    var requestAttributes = [
      'classification',
      'category',
    ];
    var options = {
      attributes: requestAttributes,
      decorators: [],
      expand: 'resources',
    };
    var serviceUrl = $stateParams.serviceId + '/tags/';

    return CollectionsApi.get('services', serviceUrl, options);
  }
  /** @ngInject */
  function StateController($state, service, tags, CollectionsApi, EditServiceModal, RetireServiceModal, OwnershipServiceModal,
                           EventNotifications, Consoles, Chargeback, PowerOperations) {
    var vm = this;
    setInitialVars();

    if (angular.isUndefined(vm.service.vms)) {
      vm.vms = [];
    } else {
      vm.vms = vm.service.vms;
    }

    var actions = vm.service.actions;
    if (angular.isDefined(actions)) {
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
    };

    activate();

    function activate() {
      Chargeback.processReports(vm.service);
    }

    function setInitialVars() {
      vm.showRemoveService = $state.actionFeatures.serviceDelete.show;
      vm.showRetireService = $state.actionFeatures.serviceRetireNow.show;
      vm.showScheduleRetirementService = $state.actionFeatures.serviceRetire.show;
      vm.showEditService = $state.actionFeatures.serviceEdit.show;
      vm.showReconfigureService = $state.actionFeatures.serviceReconfigure.show;
      vm.showSetOwnership = $state.actionFeatures.serviceOwnership.show;

      vm.service = service;
      vm.tags = tags;
      vm.activate = activate;
      vm.removeService = removeService;
      vm.editServiceModal = editServiceModal;
      vm.retireServiceNow = retireServiceNow;
      vm.retireServiceLater = retireServiceLater;
      vm.ownershipServiceModal = ownershipServiceModal;
      vm.reconfigureService = reconfigureService;
      vm.gotoCatalogItem = gotoCatalogItem;

      vm.startService = PowerOperations.startService;
      vm.stopService = PowerOperations.stopService;
      vm.suspendService = PowerOperations.suspendService;
      vm.powerOperationOffState = PowerOperations.powerOperationOffState;
      vm.powerOperationUnknownState = PowerOperations.powerOperationUnknownState;
      vm.powerOperationInProgressState = PowerOperations.powerOperationInProgressState;
      vm.powerOperationTimeoutState = PowerOperations.powerOperationTimeoutState;
      vm.powerOperationSuspendState = PowerOperations.powerOperationSuspendState;
      vm.vmMenuButtons = setupVmMenuButtons();
    }
    function vmButtonEnabled(action, item) {
      switch (action.actionName) {
        case 'htmlConsole':
          if (item['supports_console?'] && item.power_state === 'on') {
            return true;
          }
          break;
        case 'cockpitConsole':
          if (item['supports_cockpit?'] && item.power_state === 'on') {
            return true;
          }
          break;
        case 'viewVm':
          return true;
      }

      return false;
    }
    function removeService() {
      CollectionsApi.delete('services', vm.service.id).then(removeSuccess, removeFailure);

      function removeSuccess() {
        EventNotifications.success(vm.service.name + __(' was removed.'));
        $state.go('services');
      }

      function removeFailure(data) {
        EventNotifications.error(__('There was an error removing this service.'));
      }
    }

    function setupVmMenuButtons() { 
      var vmMenuButtons = { actionButtons: [], buttonEnabledFn: {}};
      vmMenuButtons.buttonEnabledFn = vmButtonEnabled;
      var viewVirtualMachineAction = function(action, item) {
        $state.go('vms.details', {vmId: item.id});
      };

      vmMenuButtons.actionButtons = [
        {
          actionName: 'htmlConsole',
          class: 'fa fa-html5 btn btn-default',
          title: __('Open a HTML5 console for this VM'),
          actionFn: openConsole,
        },
        {
          actionName: 'cockpitConsole',
          title: __('Open Cockpit console for this VM'),
          class: 'fa fa-plane btn btn-default',
          actionFn: openConsole,
        },
        {
          actionName: 'viewVm',
          class: 'fa pficon pficon-virtual-machine btn btn-default vm-action-button',
          title: __('View this virtual machine details'),
          actionFn: viewVirtualMachineAction,
        }, 
      ];

      return vmMenuButtons;
    }
   
    function openConsole(action, item) {
      Consoles.open(item.id);
    }

    function editServiceModal() {
      EditServiceModal.showModal(vm.service);
    }

    function gotoCatalogItem() {
      $state.go('marketplace.details', {serviceTemplateId: service.service_template.id});
    }

    function ownershipServiceModal() {
      OwnershipServiceModal.showModal([vm.service]);
    }

    function retireServiceNow() {
      var data = {action: 'retire'};
      CollectionsApi.post('services', vm.service.id, {}, data).then(retireSuccess, retireFailure);

      function retireSuccess() {
        EventNotifications.success(vm.service.name + __(' was retired.'));
        $state.go('services');
      }

      function retireFailure() {
        EventNotifications.error(__('There was an error retiring this service.'));
      }
    }

    function retireServiceLater() {
      RetireServiceModal.showModal(vm.service);
    }

    function disableStopButton(item) {
      return (vm.powerOperationOffState(item)
        || vm.powerOperationUnknownState(item)
        || vm.powerOperationInProgressState(item))
        && !vm.powerOperationTimeoutState(item);
    }

    function disableSuspendButton(item) {
      return (vm.powerOperationSuspendState(item)
        || vm.powerOperationUnknownState(item)
        || vm.powerOperationInProgressState(item))
        && !vm.powerOperationTimeoutState(item);
    }

    vm.enableStartButton = function(item) {
      return vm.powerOperationUnknownState(item)
        || vm.powerOperationOffState(item)
        || vm.powerOperationSuspendState(item)
        || vm.powerOperationTimeoutState(item);
    };

    vm.checkDisabled = function (action, item) {
      if (action === 'stop') {
        return disableStopButton(item);
      } else if (action === 'suspend') {
        return disableSuspendButton(item);
      }
    };

    vm.handlePowerOperation = function (action, item) {
      if (action === 'stop' && !vm.checkDisabled(action, item)) {
        vm.stopService(item);
      } else if (action === 'suspend' && !vm.checkDisabled(action, item)) {
        vm.suspendService(item);
      }
    };
  }
})();

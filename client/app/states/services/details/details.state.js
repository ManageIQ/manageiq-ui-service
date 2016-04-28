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
      decorators: [ 'vms.supports_console?' ],
      expand: 'vms',
    };

    return CollectionsApi.get('services', $stateParams.serviceId, options);
  }

  /** @ngInject */
  function StateController($state, service, CollectionsApi, EditServiceModal, RetireServiceModal, OwnershipServiceModal, Notifications, jQuery, $http, $timeout, logger) {
    var vm = this;

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
    vm.openConsole = openConsole;

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
      pf-data-list, and pf-data-list's actionButtons doesn't support hiding buttons
      based on a condition
      so the button gets .open-console-button instead of ng-click="vm.openConsole(item)"
      and we're abusing onClick to verify the event came from that button and call
      openConsole if so
     */
    function maybeOpenConsole(item, event) {
      var $target = jQuery(event.target);
      if ($target.is('.open-console-button') || $target.is('.open-console-button *')) {
        openConsole(item);
      }
    }

    function openConsole(vm) {
      CollectionsApi.post('vms', vm.id, {}, {
        action: 'request_console',
        resource: { protocol: "html5" },
      })
      .then(consoleResponse)
      .catch(consoleError);

      function consoleResponse(response) {
        if (!response.success) {
          // for some reason failure is 200 + success=false here, so throwing the message to use the same error handler
          throw response.message;
        }

        logger.info(__("Waiting for the console to become ready:"), response.message);

        consoleWatch(response.task_href + '?attributes=task_results');
      }

      function consoleError(error) {
        logger.error(__("There was an error opening the console:"), error);
      }

      // try to get the task results every second, until Finished (or error)
      function consoleWatch(url) {
        $timeout(function() {
          $http.get(url)
          .then(function(response) {
            var task = response.data;

            if ((task.state == 'Finished') && (task.status == 'Ok')) {
              // success
              consoleOpen(task.task_results);
            } else if ((task.state == 'Queued') && (task.status == 'Ok')) {
              // waiting
              consoleWatch(url);
            } else {
              // failure
              throw task.message;
            }
          })
          .catch(consoleError);
        }, 1000);
      }

      function consoleOpen(results) {
        console.log('consoleOpen', results);
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

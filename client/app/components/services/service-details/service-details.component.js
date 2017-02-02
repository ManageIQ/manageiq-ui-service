/* eslint camelcase: "off" */
export const ServiceDetailsComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    service: "=",
    tags: "=",
  },
  templateUrl: 'app/components/services/service-details/service-details.html',
};

/** @ngInject */
function ComponentController($state, $window, CollectionsApi, EventNotifications, Chargeback, Consoles,
                             TagEditorModal, ModalService, PowerOperations, ServicesState) {
  var vm = this;

  vm.$onInit = activate();
  vm.$onChanges = function(changesObj) {
    createResourceGroups();
  };
  
  function activate() {
    Chargeback.processReports(vm.service);

    angular.extend(vm, {
      title: vm.service.name,
      // Functions
      isAnsibleService: isAnsibleService,
      hasCustomButtons: hasCustomButtons,
      disableStopButton: disableStopButton,
      disableSuspendButton: disableSuspendButton,
      disableStartButton: disableStartButton,
      startService: startService,
      stopService: stopService,
      suspendService: suspendService,
      toggleOpenResourceGroup: toggleOpenResourceGroup,
      openCockpit: openCockpit,
      openConsole: openConsole,
      startVM: startVM,
      stopVM: stopVM,
      suspendVM: suspendVM,
      gotoComputeResource: gotoComputeResource,
      gotoService: gotoService,
      gotoServices: gotoServices,
      gotoCatalogItem: gotoCatalogItem,

      // Config setup
      listActions: getListActions(),
      headerConfig: getHeaderConfig(),
      resourceListConfig: getResourceListConfig(),
    });

    var actions = vm.service.actions;
    if (angular.isDefined(actions)) {
      for (var i = 0; i < actions.length; i++) {
        if (actions[i].name === "reconfigure") {
          vm.service.reconfigure = true;
        }
      }
    }

    createResourceGroups();
  }

  function isAnsibleService() {
    var compareValue = angular.isDefined(vm.service.type) ? vm.service.type : vm.service.name;

    return compareValue.toLowerCase().indexOf('ansible') !== -1;
  }

  function hasCustomButtons() {
    return angular.isDefined(vm.service.customActions)
      && angular.isArray(vm.service.customActions.buttons)
      && vm.service.customActions.buttons.length > 0;
  }

  function getListActions() {
    var configActions, lifeCycleActions, policyActions;
    var listActions = [];

    if (!isAnsibleService()) {
      listActions.push(
        {
          title: __('Power Operations'),
          actionName: 'powerOperations',
          icon: 'fa fa-power-off',
          actions: [
            {
              name: __('Start'),
              actionName: 'start',
              title: __('Start the Service'),
              actionFn: startService,
              isDisabled: disableStartButton(vm.service),
            }, {
              name: __('Stop'),
              actionName: 'stop',
              title: __('Stop the Service'),
              actionFn: stopService,
              isDisabled: disableStopButton(vm.service),
            }, {
              name: __('Suspend'),
              actionName: 'suspend',
              title: __('Suspend the Service'),
              actionFn: suspendService,
              isDisabled: disableSuspendButton(vm.service),
            },
          ],
          isDisabled: false,
        }
      );
    }

    lifeCycleActions = ServicesState.getLifeCycleCustomDropdown(setServiceRetirement, retireService);
    if (lifeCycleActions) {
      listActions.push(lifeCycleActions);
    }

    policyActions = ServicesState.getPolicyCustomDropdown(editTags);
    if (policyActions) {
      listActions.push(policyActions);
    }

    configActions = ServicesState.getConfigurationCustomDropdown(editService, removeService, setOwnership);
    if (configActions) {
      if (vm.service.reconfigure && $state.actionFeatures.serviceReconfigure.show) {
        configActions.actions.push(
          {
            icon: 'fa fa-cog',
            name: __('Reconfigure'),
            actionName: 'reconfigure',
            title: __('Reconfigure the Service'),
            actionFn: reconfigureService,
            isDisabled: false,
          }
        );
      }
      listActions.push(configActions);
    }

    return listActions;
  }

  function disableStartButton(item) {
    return !PowerOperations.allowStartService(item);
  }

  function disableStopButton(item) {
    return !PowerOperations.allowStopService(item);
  }

  function disableSuspendButton(item) {
    return !PowerOperations.allowSuspendService(item);
  }

  function startService() {
    PowerOperations.startService(vm.service);
    vm.listActions = getListActions();
  }

  function stopService() {
    PowerOperations.stopService(vm.service);
    vm.listActions = getListActions();
  }

  function suspendService() {
    PowerOperations.suspendService(vm.service);
    vm.listActions = getListActions();
  }

  function getHeaderConfig() {
    return {
      actionsConfig: {
        actionsInclude: true,
      },
    };
  }

  function editService() {
    var modalOptions = {
      component: 'editServiceModal',
      resolve: {
        service: function() {
          return vm.service;
        },
      },
    };
    ModalService.open(modalOptions);
  }

  function editTags() {
    TagEditorModal.showModal(vm.service, vm.tags);
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

  function setOwnership() {
    var modalOptions = {
      component: 'ownershipServiceModal',
      resolve: {
        services: function() {
          return [vm.service];
        },
        users: resolveUsers,
        groups: resolveGroups,
      },
    };

    ModalService.open(modalOptions);

    /** @ngInject */
    function resolveUsers(CollectionsApi) {
      var options = {expand: 'resources', attributes: ['userid', 'name'], sort_by: 'name', sort_options: 'ignore_case'};

      return CollectionsApi.query('users', options);
    }

    /** @ngInject */
    function resolveGroups(CollectionsApi) {
      var options = {expand: 'resources', attributes: ['description'], sort_by: 'description', sort_options: 'ignore_case'};

      return CollectionsApi.query('groups', options);
    }
  }

  function reconfigureService() {
    $state.go('services.reconfigure', {serviceId: vm.service.id});
  }

  function setServiceRetirement() {
    var modalOptions = {
      component: 'retireServiceModal',
      resolve: {
        services: function() {
          return [vm.service];
        },
      },
    };
    ModalService.open(modalOptions);
  }

  function retireService() {
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

  function getResourceListConfig() {
    return {
      showSelectBox: false,
    };
  }

  function createResourceGroups() {
    vm.computeGroup = {
      title: __('Compute'),
      open: true,
      resourceTypeClass: 'pficon pficon-screen',
      emptyMessage: __('There are no Compute Resources for this service.'),
      resources: vm.service.vms || [],
    };
  }

  function toggleOpenResourceGroup(group) {
    group.open = !group.open;
  }

  function openConsole(item) {
    Consoles.open(item.id);
  }

  function openCockpit(item) {
    $window.open('http://' + item.ipaddresses[0] + ':9090');
  }

  function gotoComputeResource(resource) {
    $state.go('vms.details', {vmId: resource.id});
  }

  function startVM(item) {
    PowerOperations.startVm(item);
  }

  function stopVM(item) {
    PowerOperations.stopVm(item);
  }

  function suspendVM(item) {
    PowerOperations.suspendVm(item);
  }

  function gotoCatalogItem() {
    $state.go('catalogs.details', {serviceTemplateId: vm.service.service_template.id});
  }

  function gotoServices() {
    $state.go('services.explorer');
  }

  function gotoService(service) {
    $state.go('services.details', {serviceId: service.id});
  }
}

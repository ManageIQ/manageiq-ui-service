(function() {
  'use strict';

  angular.module('app.components')
    .component('requestWorkflow', {
      bindings: {
        workflow: '=?',
      },
      controller: requestWorkflowController,
      controllerAs: 'vm',
      templateUrl: 'app/components/request-workflow/request-workflow.html',
    });

  /** @ngInject */
  function requestWorkflowController(API_BASE, lodash) {
    var vm = this;
    vm.$onInit = activate;
    vm.customizedWorkflow = {};

    vm.API_BASE = API_BASE;

    function activate() {
      if (vm.workflow) {
        initCustomizedWorkflow();
        angular.forEach(vm.customizedWorkflow['dialog_order'], setTabPanelTitle);
      }
    }

    // Private functions
    function initCustomizedWorkflow(key) {
      vm.customizedWorkflow['dialog_order'] = vm.workflow.dialogs.dialog_order;
      vm.customizedWorkflow['dialogs'] = vm.workflow.dialogs.dialogs;
    }

    function setTabPanelTitle(key) {
      vm.customizedWorkflow['dialogs'][key].panelTitle = [];
      switch (key) {
        case 'requester':
          vm.customizedWorkflow['dialogs'][key].panelTitle[0] = (__("Request Information"));
          vm.customizedWorkflow['dialogs'][key].panelTitle[1] = (__("Manager"));
          break;
        case 'purpose':
          vm.customizedWorkflow['dialogs'][key].panelTitle[0] = (__("Select Tags to apply"));
          break;
        case 'service':
          vm.customizedWorkflow['dialogs'][key].panelTitle[0] = (__("Selected VM"));
          vm.customizedWorkflow['dialogs'][key].panelTitle[1] = (__("Number of VMs"));
          vm.customizedWorkflow['dialogs'][key].panelTitle[2] = (__("Naming"));
          break;
        case 'environment':
          vm.customizedWorkflow['dialogs'][key].panelTitle[0] = (__("Placement"));
          break;
        case 'hardware':
          vm.customizedWorkflow['dialogs'][key].panelTitle[0] = (__("Hardware"));
          vm.customizedWorkflow['dialogs'][key].panelTitle[1] = (__("VM Reservations"));
          break;
        case 'network':
          vm.customizedWorkflow['dialogs'][key].panelTitle[0] = (__("Network Adapter Information"));
          break;
        case 'customize':
          vm.customizedWorkflow['dialogs'][key].panelTitle[0] = (__("Credentials"));
          vm.customizedWorkflow['dialogs'][key].panelTitle[1] = (__("IP Address Information"));
          vm.customizedWorkflow['dialogs'][key].panelTitle[2] = (__("DNS"));
          vm.customizedWorkflow['dialogs'][key].panelTitle[3] = (__("Customize Template"));
          vm.customizedWorkflow['dialogs'][key].panelTitle[4] = (__("Selected Template Contents"));
          break;
        case 'schedule':
          vm.customizedWorkflow['dialogs'][key].panelTitle[0] = (__("Schedule Info"));
          vm.customizedWorkflow['dialogs'][key].panelTitle[1] = (__("Lifespan"));
          break;
      }
    }
  }
})();

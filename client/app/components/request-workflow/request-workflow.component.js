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
          requesterFieldsLayout(vm.customizedWorkflow['dialogs'][key].panelTitle.length);
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

    function requesterFieldsLayout (nPanels) {
      var fields = {
        owner_email         : { label: 'owner_email', panel: 0, order : 0 },
        owner_first_name    : { label: 'owner_first_name', panel: 0, order : 1 },
        owner_last_name     : { label: 'owner_last_name', panel: 0, order : 2 },
        owner_address       : { label: 'owner_address', panel: 0, order : 3 },
        owner_city          : { label: 'owner_city', panel: 0, order : 4 },
        owner_state         : { label: 'owner_state', panel: 0, order : 5 },
        owner_zip           : { label: 'owner_zip', panel: 0, order : 6 },
        owner_country       : { label: 'owner_country', panel: 0, order : 7 },
        owner_title         : { label: 'owner_title', panel: 0, order : 8 },
        owner_company       : { label: 'owner_company', panel: 0, order : 9 },
        owner_department    : { label: 'owner_department', panel: 0, order : 10 },
        owner_office        : { label: 'owner_office', panel: 0, order : 11 },
        owner_phone         : { label: 'owner_phone', panel: 0, order : 12 },
        owner_phone_mobile  : { label: 'owner_phone_mobile', panel: 0, order : 13 },
        request_notes       : { label: 'request_notes', panel: 0, order : 14 },
        owner_manager       : { label: 'owner_manager', panel: 1, order : 0 },
        owner_manager_mail  : { label: 'owner_manager_mail', panel: 1, order : 1 },
        owner_manager_phone : { label: 'owner_manager_phone', panel: 1, order : 2 },
      };

      lodash.merge(vm.customizedWorkflow['dialogs']['requester'].fields, fields);

      vm.customizedWorkflow['dialogs']['requester'].fieldsInPanel = [];

      lodash.times(nPanels, function(key, value) {
        vm.customizedWorkflow['dialogs']['requester'].fieldsInPanel[key] =
          Object.values(lodash.filter(vm.customizedWorkflow['dialogs']['requester'].fields, {'panel': key}));
      });
    }
  }
})();

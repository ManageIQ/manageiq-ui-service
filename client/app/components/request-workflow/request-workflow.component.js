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
        angular.forEach(vm.customizedWorkflow.dialogOrder, setTabPanelTitleForEnabledDialog);
      }
    }

    // Private functions
    function initCustomizedWorkflow(key) {
      vm.customizedWorkflow.dialogOrder = lodash.cloneDeep(vm.workflow.dialogs.dialog_order);
      vm.customizedWorkflow.dialogs = lodash.cloneDeep(vm.workflow.dialogs.dialogs);
      vm.customizedWorkflow.values = lodash.cloneDeep(vm.workflow.values);
      processWorkflowValues();
    }

    function processWorkflowValues() {
      angular.forEach(vm.customizedWorkflow.values, function (value, key) {
        if (angular.isArray(value)) {
          vm.customizedWorkflow.values[key] = value[1];
        }
      });
    }
    
    vm.bEnableDialog = function(dialog) {
      if (!vm.customizedWorkflow.values[dialog + '_enabled']
          || vm.customizedWorkflow.values[dialog + '_enabled'][0] === "enabled") {
        return true;
      } else {
        return false;
      }
    };

    function setTabPanelTitleForEnabledDialog(dialog) {
      if (vm.bEnableDialog(dialog)) {
        setTabPanelTitle(dialog);
      }
    }

    function setTabPanelTitle(key) {
      var fields = {};
      vm.customizedWorkflow.dialogs[key].panelTitle = [];

      switch (key) {
        case 'requester':
          vm.customizedWorkflow.dialogs[key].panelTitle[0] = (__("Request Information"));
          vm.customizedWorkflow.dialogs[key].panelTitle[1] = (__("Manager"));
          fields = requesterFields();
          break;
        case 'purpose':
          vm.customizedWorkflow.dialogs[key].panelTitle[0] = (__("Select Tags to apply"));
          break;
        case 'service':
          // revisit this after https://github.com/ManageIQ/manageiq/pull/13441 is merged
          if (lodash.includes(vm.customizedWorkflow.values.miq_request_dialog_name, "redhat")) {
            vm.customizedWorkflow.dialogs[key].panelTitle[0] = (__("Selected VM"));
          } else {
            vm.customizedWorkflow.dialogs[key].panelTitle[0] = (__("Select"));
          }
          if (lodash.includes(vm.customizedWorkflow.values.provision_type, "pxe")) {
            vm.customizedWorkflow.dialogs[key].panelTitle[1] = (__("PXE"));
          } else if (lodash.includes(vm.customizedWorkflow.values.provision_type, "iso")) {
            vm.customizedWorkflow.dialogs[key].panelTitle[1] = (__("ISO"));
          }
          vm.customizedWorkflow.dialogs[key].panelTitle[1] = (__("Number of VMs"));
          vm.customizedWorkflow.dialogs[key].panelTitle[2] = (__("Naming"));
          fields = serviceFields();
          break;
        case 'environment':
          vm.customizedWorkflow.dialogs[key].panelTitle[0] = (__("Placement"));
          break;
        case 'hardware':
          vm.customizedWorkflow.dialogs[key].panelTitle[0] = (__("Hardware"));
          vm.customizedWorkflow.dialogs[key].panelTitle[1] = (__("VM Reservations"));
          break;
        case 'network':
          vm.customizedWorkflow.dialogs[key].panelTitle[0] = (__("Network Adapter Information"));
          break;
        case 'customize':
          vm.customizedWorkflow.dialogs[key].panelTitle[0] = (__("Credentials"));
          vm.customizedWorkflow.dialogs[key].panelTitle[1] = (__("IP Address Information"));
          vm.customizedWorkflow.dialogs[key].panelTitle[2] = (__("DNS"));
          vm.customizedWorkflow.dialogs[key].panelTitle[3] = (__("Customize Template"));
          vm.customizedWorkflow.dialogs[key].panelTitle[4] = (__("Selected Template Contents"));
          break;
        case 'schedule':
          vm.customizedWorkflow.dialogs[key].panelTitle[0] = (__("Schedule Info"));
          vm.customizedWorkflow.dialogs[key].panelTitle[1] = (__("Lifespan"));
          break;
      }
      fieldsLayout(key, fields, vm.customizedWorkflow.dialogs[key].panelTitle.length);
    }

    function requesterFields() {
      return {
        ownerEmail: { label: 'owner_email', panel: 0, order: 0 },
        ownerFirstName: { label: 'owner_first_name', panel: 0, order: 1 },
        ownerLastName: { label: 'owner_last_name', panel: 0, order: 2 },
        ownerAddress: { label: 'owner_address', panel: 0, order: 3 },
        ownerCity: { label: 'owner_city', panel: 0, order: 4 },
        ownerState: { label: 'owner_state', panel: 0, order: 5 },
        ownerZip: { label: 'owner_zip', panel: 0, order: 6 },
        ownerCountry: { label: 'owner_country', panel: 0, order: 7 },
        ownerTitle: { label: 'owner_title', panel: 0, order: 8 },
        ownerCompany: { label: 'owner_company', panel: 0, order: 9 },
        ownerDepartment: { label: 'owner_department', panel: 0, order: 10 },
        ownerOffice: { label: 'owner_office', panel: 0, order: 11 },
        ownerPhone: { label: 'owner_phone', panel: 0, order: 12 },
        ownerPhoneMobile: { label: 'owner_phone_mobile', panel: 0, order: 13 },
        requestNotes: { label: 'request_notes', panel: 0, order: 14 },
        ownerManager: { label: 'owner_manager', panel: 1, order: 0 },
        ownerManagerMail: { label: 'owner_manager_mail', panel: 1, order: 1 },
        ownerManagerPhone: { label: 'owner_manager_phone', panel: 1, order: 2 },
      };
    }

    function serviceFields() {
      var serviceFields = {};
      // revisit this after https://github.com/ManageIQ/manageiq/pull/13441 is merged
      if (lodash.includes(vm.customizedWorkflow.values.miq_request_dialog_name, "redhat")) {
        serviceFields =  {
          srcVmId: {label: 'src_vm_id', panel: 0, order: 0},
          provisionType: {label: 'provision_type', panel: 0, order: 1},
          linkedClone: {label: 'linked_clone', panel: 0, order: 2},
        };
      } else {
        serviceFields =  {
          vmFilter: {label: 'vm_filter', panel: 0, order: 0},
          srcVmId: {label: 'src_vm_id', panel: 0, order: 1},
          provisionType: {label: 'provision_type', panel: 0, order: 2},
          linkedClone: {label: 'linked_clone', panel: 0, order: 4},
          snapshot: {label: 'snapshot', panel: 0, order: 5},
        };
        var serviceFieldsCommon = {
          numberOfVms: {label: 'number_of_vms', panel: 1, order: 0},
          vmName: {label: 'vm_name', panel: 2, order: 0},
          vmDescription: {label: 'vm_description', panel: 2, order: 1},
          vmPrefix: {label: 'vm_prefix', panel: 2, order: 2},
        };
      }

      return lodash.extend(serviceFields, serviceFieldsCommon);
    }

    function fieldsLayout(tab, fields, nPanels) {
      vm.customizedWorkflow.dialogs[tab].fieldsInPanel = [];
      
      lodash.merge(vm.customizedWorkflow.dialogs[tab].fields,
        lodash.mapKeys(fields, function (v, k) { return lodash.snakeCase(k); }));
      lodash.times(nPanels, function(key, value) {
        vm.customizedWorkflow.dialogs[tab].fieldsInPanel[key]
          = Object.values(lodash.filter(vm.customizedWorkflow.dialogs[tab].fields, {'panel': key}));
      });
    }
  }
})();

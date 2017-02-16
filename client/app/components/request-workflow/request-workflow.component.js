export const RequestWorkflowComponent = {
  bindings: {
    workflow: '=?',
    workflowClass: '=?',
    allowedTags: '=?',
  },
  templateUrl: 'app/components/request-workflow/request-workflow.html',
  controller: requestWorkflowController,
  controllerAs: 'vm',
};

/** @ngInject */
function requestWorkflowController(API_BASE, lodash, CollectionsApi, $q) {
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
    var titlePromiseArray = [];

    vm.customizedWorkflow.dialogs[key].panelTitle = [];

    nodeTypeTitle('clusters', titlePromiseArray);
    nodeTypeTitle('hosts', titlePromiseArray);
    $q.all(titlePromiseArray).then(function(data) {
      populateTabs(key, getClusterTitle(data[0]), getHostTitle(data[1]));
    });

    function populateTabs(key, clusterTitle, hostTitle) {
      var panelFields, panelTitles;
      switch (key) {
        case 'requester':
          panelTitles = [__("Request Information"), __("Manager")];
          panelFields = [['owner_email', 'owner_first_name', 'owner_last_name', 'owner_address', 'owner_city',
            'owner_state', 'owner_zip', 'owner_country', 'owner_title', 'owner_company',
            'owner_department', 'owner_office', 'owner_phone', 'owner_phone_mobile', 'request_notes'],
            ['owner_manager', 'owner_manager_mail', 'owner_manager_phone']];

          fields = getFields(key, panelTitles, panelFields);
          break;
        case 'purpose':
          panelTitles = [__("Select Tags to apply")];
          panelFields = [['vm_tags']];

          fields = getFields(key, panelTitles, panelFields);
          break;
        case 'service':
          if (lodash.every(["Redhat", "InfraManager"], function (value, key) {
            return lodash.includes(vm.workflowClass, value);
          })) {
            panelTitles = [__("Selected VM")];
          } else {
            panelTitles = [__("Select")];
          }
          if (lodash.includes(vm.customizedWorkflow.values.provision_type, "pxe")) {
            panelTitles.push(__("PXE"));
          } else if (lodash.includes(vm.customizedWorkflow.values.provision_type, "iso")) {
            panelTitles.push(__("ISO"));
          }
          if (lodash.includes(vm.workflowClass, "CloudManager")) {
            panelTitles.push(__("Number of Instances"));
          } else {
            panelTitles.push(__("Number of VMs"));
          }
          panelTitles.push(__("Naming"));

          if (lodash.every(["Redhat", "InfraManager"], function(value, key) {
            return lodash.includes(vm.workflowClass, value);
          })) {
            panelFields = [['src_vm_id', 'provision_type', 'linked_clone'],
                           ['number_of_vms'],
                           ['vm_name', 'vm_description', 'vm_prefix']];
          } else {
            panelFields = [['vm_filter', 'src_vm_id', 'provision_type', 'linked_clone', 'snapshot'],
                           ['number_of_vms'],
                           ['vm_name', 'vm_description', 'vm_prefix']];
          }

          fields = getFields(key, panelTitles, panelFields);
          break;
        case 'environment':
          panelTitles = [__("Placement")];

          if (vm.customizedWorkflow.values.placement_auto === 0
            && !lodash.includes(vm.workflowClass, "CloudManager")) {
            panelTitles.push(__("Datacenter"));
            panelTitles.push(clusterTitle);
            if (lodash.every(["Vmware", "InfraManager"], function(value, key) {
              return lodash.includes(vm.workflowClass, value);
            })) {
              panelTitles.push(__("Resource Pool"));
              panelTitles.push(__("Folder"));
            }

            panelTitles.push(hostTitle);

            if (!lodash.includes(vm.workflowClass, "CloudManager")) {
              panelTitles.push(__("Datastore"));
            } else {
              panelTitles.push(__("Placement - Options"));
            }
          }
          panelFields = [
            ['placement_auto'],
            ['placement_dc_name'],
            ['cluster_filter', 'placement_cluster_name'],
            ['rp_filter', 'placement_rp_name'],
            ['placement_folder_name'],
            ['host_filter', 'placement_host_name'],
            ['ds_filter', 'placement_storage_profile', 'placement_ds_name'],
            ['cloud_tenant', 'availability_zone_filter', 'placement_availability_zone', 'cloud_network', 'cloud_subnet',
              'security_groups', 'floating_ip_address', 'resource_group'],
          ];

          fields = getFields(key, panelTitles, panelFields);
          break;
        case 'hardware':
          if (lodash.includes(vm.workflowClass, "CloudManager")) {
            panelTitles = [__("Properties")];
          } else {
            panelTitles = [__("Hardware"), __("VM Limits"), __("VM Reservations")];
          }
          panelFields = [
            ['instance_type', 'number_of_cpus', 'number_of_sockets', 'cores_per_socket', 'vm_memory',
              'network_adapters', 'disk_format', 'guest_access_key_pair', 'monitoring', 'vm_dynamic_memory',
              'vm_minimum_memory', 'vm_maximum_memory', 'boot_disk_size', 'is_preemptible'],
            ['cpu_limit', 'memory_limit'],
            ['cpu_reserve', 'memory_reserve'],
          ];

          fields = getFields(key, panelTitles, panelFields);
          break;
        case 'network':
          panelTitles = [__("Network Adapter Information")];
          panelFields = [['vlan', 'mac_address']];

          fields = getFields(key, panelTitles, panelFields);
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
  }
  
  function setSubPanelTitleAndFields(nPanel, key, panelTitle, arrFields) {
    var fieldsObject = {};
    var i = 0;

    vm.customizedWorkflow.dialogs[key].panelTitle[nPanel] = panelTitle;

    lodash.forEach(arrFields, function (value) {
      var obj = {label: value, panel: nPanel, order: i++};
      var tempObj = {};

      tempObj[value] = obj;
      lodash.merge(fieldsObject, tempObj);
    });

    return fieldsObject;
  }

  function getFields(key, panelTitles, panelFields) {
    var i = 0;
    var j = 0;
    var fields = {};
    lodash.forEach(panelTitles, function (panelTitle) {
      lodash.merge(fields, setSubPanelTitleAndFields(i++, key, panelTitle, panelFields[j++]));
    });

    return fields;
  }

  function fieldsLayout(tab, fields, nPanels) {
    vm.customizedWorkflow.dialogs[tab].fieldsInPanel = [];

    vm.customizedWorkflow.dialogs[tab].fields
      = lodash.filter(lodash.merge(vm.customizedWorkflow.dialogs[tab].fields,
      lodash.mapKeys(fields, function (v, k) { return k; })),
        function(o) { return angular.isDefined(o.display); });

    lodash.times(nPanels, function(key, value) {
      vm.customizedWorkflow.dialogs[tab].fieldsInPanel[key]
        = Object.values(lodash.filter(vm.customizedWorkflow.dialogs[tab].fields, {'panel': key}));
    });
  }

  function nodeTypeTitle(collection, titlePromiseArray) {
    titlePromiseArray.push(CollectionsApi.options(collection)
      .then(successNodeTypeTitle));

    function successNodeTypeTitle(response) {
      return response.data.node_types;
    }
  }

  function getClusterTitle(nodeType) {
    var title;

    switch (nodeType) {
      case 'non_openstack':
        title = __("Cluster");
        break;
      case 'openstack':
        title = __("Deployment Role");
        break;
      default:
        title = __("Cluster / Deployment Role");
        break;
    }

    return title;
  }

  function getHostTitle(nodeType) {
    var title;

    switch (nodeType) {
      case 'non_openstack':
        title = __("Host");
        break;
      case 'openstack':
        title = __("Node");
        break;
      default:
        title = __("Host / Node");
        break;
    }

    return title;
  }
}

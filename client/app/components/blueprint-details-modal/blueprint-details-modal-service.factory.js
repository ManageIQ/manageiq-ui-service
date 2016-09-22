/*eslint camelcase: "off" */
(function() {
  'use strict';

  angular.module('app.components')
    .factory('BlueprintDetailsModal', BlueprintDetailsFactory);

  /** @ngInject */
  function BlueprintDetailsFactory($modal) {
    var modalBlueprint = {
      showModal: showModal,
    };

    return modalBlueprint;

    function showModal(action, blueprint) {
      var modalOptions = {
        templateUrl: 'app/components/blueprint-details-modal/blueprint-details-modal.html',
        controller: BlueprintDetailsModalController,
        controllerAs: 'vm',
        resolve: {
          action: resolveAction,
          blueprint: resolveBlueprint,
          serviceCatalogs: resolveServiceCatalogs,
          serviceDialogs: resolveServiceDialogs,
          tenants: resolveTenants,
        },
      };

      var modal = $modal.open(modalOptions);

      return modal.result;

      function resolveBlueprint() {
        return blueprint;
      }

      function resolveAction() {
        return action;
      }

      function resolveServiceCatalogs(CollectionsApi) {
        var options = {
          expand: 'resources',
          sort_by: 'name',
          sort_options: 'ignore_case'};

        return CollectionsApi.query('service_catalogs', options);
      }

      function resolveServiceDialogs(CollectionsApi) {
        var options = {
          expand: 'resources',
          attributes: ['id', 'description', 'label'],
          sort_by: 'description',
          sort_options: 'ignore_case'};

        return CollectionsApi.query('service_dialogs', options);
      }

      function resolveTenants(CollectionsApi) {
        var options = {
          expand: 'resources',
          attributes: ['id', 'name'],
          sort_by: 'name',
          sort_options: 'ignore_case',
        };

        return CollectionsApi.query('tenants', options);
      }
    }
  }

  /** @ngInject */
  function BlueprintDetailsModalController(action, blueprint, BlueprintsState, BlueprintOrderListService, serviceCatalogs,  // jshint ignore:line
                                           serviceDialogs, tenants, $state, BrowseEntryPointModal, CreateCatalogModal, $modalInstance,
                                           EventNotifications, sprintf, $scope) {
    var vm = this;
    vm.blueprint = blueprint;

    vm.tabs = [
      {"title": __('General'), "active": true},
      {"title": __('Publish'), "active": false},
      {"title": __('Provision Order'), "active": false},
      {"title": __('Action Order'), "active": false},
    ];

    if (action === 'create') {
      vm.modalTitle = __('Create Blueprint');
      vm.modalBtnPrimaryLabel  = __('Create');
    } else if (action === 'publish') {
      vm.modalTitle = __('Publish ') + vm.blueprint.name;
      vm.modalBtnPrimaryLabel  = __('Publish');
      vm.tabs[0].active = false;
      vm.tabs[1].active = true;
    } else {
      vm.modalTitle = __('Edit Blueprint Details');
      vm.modalBtnPrimaryLabel  = __('Save');
    }

    vm.serviceCatalogs = serviceCatalogs.resources;

    vm.serviceDialogs = serviceDialogs.resources;

    vm.tags = {"ofItem": vm.blueprint.tags};

    vm.visibilityOptions = [{
      id: 800,
      name: 'Private',
    }, {
      id: 900,
      name: 'Public',
    }];
    vm.visibilityOptions = vm.visibilityOptions.concat(tenants.resources);

    vm.provOrderChanged = false;
    vm.actionOrderChanged = false;
    vm.actionOrderEqualsProvOrder = true;

    vm.saveBlueprintDetails = saveBlueprintDetails;
    vm.cancelBlueprintDetails = cancelBlueprintDetails;
    vm.isCatalogUnassigned = isCatalogUnassigned;
    vm.isCatalogRequired = isCatalogRequired;
    vm.isDialogRequired = isDialogRequired;
    vm.selectEntryPoint = selectEntryPoint;
    vm.createCatalog = createCatalog;
    vm.toggleAdvOps = toggleAdvOps;
    vm.disableOrderListTabs = disableOrderListTabs;
    vm.dndServiceItemMoved = dndServiceItemMoved;
    vm.toggleActionEqualsProvOrder = toggleActionEqualsProvOrder;

    vm.modalData = {
      'action': action,
      'resource': {
        'name': vm.blueprint.name || __('Untitled Blueprint ') + BlueprintsState.getNextUniqueId(),
        'description': vm.blueprint.description,
        'visibility': vm.blueprint.visibility,
        'catalog_id': (vm.blueprint.content.service_catalog ? vm.blueprint.content.service_catalog.id : null ),
        'dialog_id': (vm.blueprint.content.service_dialog ? vm.blueprint.content.service_dialog.id : null ),
      },
    };

    setModalDataEntrypoints();

    BlueprintOrderListService.setOrderLists(vm);

    if (!vm.modalData.resource.visibility) {
      vm.modalData.resource.visibility = vm.visibilityOptions[0];
    } else {
      vm.modalData.resource.visibility = vm.visibilityOptions[
            findWithAttr(vm.visibilityOptions, 'id', vm.modalData.resource.visibility.id)
          ];
    }

    if (vm.modalData.resource.catalog_id) {
      vm.modalData.resource.catalog = vm.serviceCatalogs[ findWithAttr(vm.serviceCatalogs, 'id', vm.modalData.resource.catalog_id) ];
    }

    if (vm.modalData.resource.dialog_id) {
      vm.modalData.resource.dialog = vm.serviceDialogs[ findWithAttr(vm.serviceDialogs, 'id', vm.modalData.resource.dialog_id) ];
    }

    function setModalDataEntrypoints() {
      vm.modalData.resource.provEP = {action: "Provision", value: ""};
      vm.modalData.resource.reConfigEP = {action: "Reconfigure", value: ""};
      vm.modalData.resource.retireEP = {action: "Retirement", value: ""};

      if (vm.blueprint.content.automate_entrypoints) {
        for (var i = 0; i < vm.blueprint.content.automate_entrypoints.length; i++) {
          var aep = vm.blueprint.content.automate_entrypoints[i];
          var newAepStr = BlueprintsState.getEntryPointString(aep);
          // console.log("modal data = " + aep.action + ": " + newAepStr);
          var newAepObj = {action: aep.action, index: i, value: newAepStr};
          switch (aep.action) {
            case "Provision":
              vm.modalData.resource.provEP = newAepObj;
              break;
            case "Reconfigure":
              vm.modalData.resource.reConfigEP = newAepObj;
              break;
            case "Retirement":
              vm.modalData.resource.retireEP = newAepObj;
              break;
          }
        }
      }
    }

    function isCatalogUnassigned() {
      return (angular.isUndefined(vm.modalData.resource.catalog) || vm.modalData.resource.catalog === null);
    }

    function isCatalogRequired() {
      return (action === 'publish') && isCatalogUnassigned();
    }

    function isDialogRequired() {
      return (action === 'publish') && (angular.isUndefined(vm.modalData.resource.dialog) || vm.modalData.resource.dialog === null);
    }

    function createCatalog() {
      var modalInstance = CreateCatalogModal.showModal();

      modalInstance.then(function(opts) {
        console.log("New Catalog Name is '" + opts.catalogName + "'");
        angular.element( "#createCatalog" ).blur();
      });
    }

    function selectEntryPoint(entryPointType) {
      var modalInstance = BrowseEntryPointModal.showModal(entryPointType);

      modalInstance.then(function(opts) {
        if (entryPointType === 'provisioning') {
          vm.modalData.resource.provEP.value = opts.entryPointData;
        } else if (entryPointType === 'reconfigure') {
          vm.modalData.resource.reConfigEP.value = opts.entryPointData;
        } else if (entryPointType === 'retirement') {
          vm.modalData.resource.retireEP.value =  opts.entryPointData;
        }
      });
    }

    function toggleAdvOps() {
      angular.element( "#advOpsHref" ).toggleClass("collapsed");
      angular.element( "#advOps" ).toggleClass("in");
    }

    function disableOrderListTabs() {
      return vm.blueprint.ui_properties.chart_data_model.nodes.length <= 1;
    }

    function toggleActionEqualsProvOrder() {
      vm.actionOrderChanged = true;
      // Make actionOrder list a new list, set parentListName to 'actionOrder'
      BlueprintOrderListService.initActionOrderFromProvOrderList(vm);
    }

    $scope.$on('dnd-item-moved', function(evt, args) {
      dndServiceItemMoved(args.item);
    });

    function dndServiceItemMoved(origItem) {
      if (origItem.parentListName === "provOrder") {
        vm.provOrderChanged = true;
      } else if (origItem.parentListName === "actionOrder") {
        vm.actionOrderChanged = true;
      }

      if (origItem.parentListName === "provOrder" && vm.actionOrderEqualsProvOrder) {
        BlueprintOrderListService.initActionOrderFromProvOrderList(vm);
      }
    }

    function cancelBlueprintDetails() {
      $modalInstance.close();
    }

    function saveBlueprintDetails() {   // jshint ignore:line
      vm.blueprint.name = vm.modalData.resource.name;
      vm.blueprint.description = vm.modalData.resource.description;

      vm.blueprint.tags = vm.tags.ofItem;

      /*
      if (!vm.blueprint.visibility || (vm.blueprint.visibility.id.toString() !== vm.modalData.resource.visibility.id.toString())) {
        vm.blueprint.visibility = vm.modalData.resource.visibility;
      }
      */

      if (vm.modalData.resource.catalog) {
        if (!vm.blueprint.content.service_catalog || vm.modalData.resource.catalog.id !== vm.blueprint.content.service_catalog.id) {
          vm.blueprint.content.service_catalog = {"id": vm.modalData.resource.catalog.id};
        }
      } else {
        if (vm.blueprint.content.service_catalog) {
          vm.blueprint.content.service_catalog = {"id": -1};
        }
      }

      if (vm.modalData.resource.dialog) {
        if (!vm.blueprint.content.service_dialog || vm.modalData.resource.dialog.id !== vm.blueprint.content.service_dialog.id) {
          vm.blueprint.content.service_dialog = {"id": vm.modalData.resource.dialog.id};
        }
      } else {
        if (vm.blueprint.content.service_dialog) {
          vm.blueprint.content.service_dialog = {"id": -1};
        }
      }

      setBlueprintEntryPtsFromModalData();

      if (vm.provOrderChanged) {
        BlueprintOrderListService.saveOrder("provisionOrder", vm);
      }

      if (vm.actionOrderChanged) {
        BlueprintOrderListService.saveOrder("actionOrder", vm);
      }

      if (action === 'publish') {
        $modalInstance.close();
        saveFailure();

        return;
      }

      /*
      console.log("Orig Blueprint = " + angular.toJson(BlueprintsState.getOriginalBlueprint().content, true));
      console.log("Updated Blueprint = " + angular.toJson(vm.blueprint.content, true));
      console.log("Diff = " + angular.toJson(BlueprintsState.difference(vm.blueprint.content,
                  BlueprintsState.getOriginalBlueprint().content), true));
      */

      saveSuccess();

      function saveSuccess() {
        if (action === 'create') {
          // This is not actually used anymore, flow has changed
          // keeping it in case flow changes back again.
          EventNotifications.success(sprintf(__('%s was created.'), vm.blueprint.name));
          $modalInstance.close();
          BlueprintsState.saveBlueprint(vm.blueprint);
          $state.go('designer/blueprints.editor', {blueprintId: vm.blueprint.id});
        } else if (action === 'edit') {
          $modalInstance.close({editedblueprint: vm.blueprint});
          // EventNotifications.success(sprintf(__('%s details were updated.'), vm.blueprint.name));
        } else if (action === 'publish') {
          $modalInstance.close();
          EventNotifications.success(sprintf(__('%s was published.'), vm.blueprint.name));
          $state.go($state.current, {}, {reload: true});
        }
      }

      function saveFailure() {
        if (action === 'publish') {
          EventNotifications.error(__('The Publish Blueprint feature is not yet implemented.'));
        } else {
          EventNotifications.error(__("There was an error saving this Blueprint's Details."));
        }
      }

      function setBlueprintEntryPtsFromModalData() {
        processEntryPoint(vm.modalData.resource.provEP);
        processEntryPoint(vm.modalData.resource.reConfigEP);
        processEntryPoint(vm.modalData.resource.retireEP);
      }

      function processEntryPoint(modalData) {
        var parts = modalData.value.split("\/");
        var instance = (parts.length ? parts.splice(-1, 1)[0] : "");
        var clazz = (parts.length ? parts.splice(-1, 1)[0] : "");
        var namespace = parts.join("\/");
        // console.log("blueprint data = " + modalData.action + " - " + namespace + ":" + clazz + ":" + instance);
        if (angular.isDefined(modalData.index)) {
          var bpAEP = vm.blueprint.content.automate_entrypoints[modalData.index];
          if (angular.isUndefined(bpAEP.ae_class) && angular.isUndefined(bpAEP.ae_instance) && angular.isUndefined(bpAEP.ae_namespace )) {
            return;
          }
          if (bpAEP.ae_namespace !== namespace) {
            bpAEP.ae_namespace = namespace;
          }
          if (bpAEP.ae_class !== clazz) {
            bpAEP.ae_class = clazz;
          }
          if (bpAEP.ae_instance !== instance) {
            bpAEP.ae_instance = instance;
          }
        } else {
          if (namespace.length || clazz.length || instance.length) {
            // console.log("Adding new entry point");
            vm.blueprint.content.automate_entrypoints.push({
              action: modalData.action,
              ae_namespace: namespace,
              ae_class: clazz,
              ae_instance: instance,
            });
          }
        }
      }
    }  // end of saveBlueprintDetails

    function findWithAttr(array, attr, value) {
      for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
          return i;
        }
      }
    }
  }
})();

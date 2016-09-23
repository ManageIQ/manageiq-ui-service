/* eslint camelcase: "off" */
/* eslint multiline-ternary: "off" */
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

    vm.tagsOfItem = vm.blueprint.tags;

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
        'visibility': vm.blueprint.ui_properties.visibility,
        'catalog': vm.blueprint.ui_properties.service_catalog,
        'dialog': vm.blueprint.ui_properties.service_dialog,
        'provEP': (vm.blueprint.ui_properties.automate_entrypoints && vm.blueprint.ui_properties.automate_entrypoints.Provision
            ? blueprint.ui_properties.automate_entrypoints.Provision : null ),
        'reConfigEP': (vm.blueprint.ui_properties.automate_entrypoints && vm.blueprint.ui_properties.automate_entrypoints.Reconfigure
            ? blueprint.ui_properties.automate_entrypoints.Reconfigure : null ),
        'retireEP': (vm.blueprint.ui_properties.automate_entrypoints && vm.blueprint.ui_properties.automate_entrypoints.Retirement
            ? blueprint.ui_properties.automate_entrypoints.Retirement : null ),
      },
    };

    BlueprintOrderListService.setOrderLists(vm);

    if (!vm.modalData.resource.visibility) {
      vm.modalData.resource.visibility = vm.visibilityOptions[0];
    } else {
      vm.modalData.resource.visibility = vm.visibilityOptions[
            findWithAttr(vm.visibilityOptions, 'id', vm.modalData.resource.visibility.id)
          ];
    }

    if (vm.modalData.resource.catalog) {
      vm.modalData.resource.catalog = vm.serviceCatalogs[ findWithAttr(vm.serviceCatalogs, 'id', vm.modalData.resource.catalog.id) ];
    }

    if (vm.modalData.resource.dialog) {
      vm.modalData.resource.dialog = vm.serviceDialogs[ findWithAttr(vm.serviceDialogs, 'id', vm.modalData.resource.dialog.id) ];
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
        angular.element( "#createCatalog" ).blur();
      });
    }

    function selectEntryPoint(entryPointType) {
      var modalInstance = BrowseEntryPointModal.showModal(entryPointType);

      modalInstance.then(function(opts) {
        if (entryPointType === 'provisioning') {
          vm.modalData.resource.provEP = opts.entryPointData;
        } else if (entryPointType === 'reconfigure') {
          vm.modalData.resource.reConfigEP = opts.entryPointData;
        } else if (entryPointType === 'retirement') {
          vm.modalData.resource.retireEP =  opts.entryPointData;
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
      vm.blueprint.ui_properties.visibility = vm.modalData.resource.visibility;

      vm.blueprint.tags = vm.tagsOfItem;

      if (vm.modalData.resource.catalog) {
        if (!vm.blueprint.ui_properties.service_catalog || vm.modalData.resource.catalog.id
            !== vm.blueprint.ui_properties.service_catalog.id) {
          vm.blueprint.ui_properties.service_catalog = {"id": vm.modalData.resource.catalog.id};
        }
      } else {
        if (vm.blueprint.ui_properties.service_catalog) {
          delete(vm.blueprint.ui_properties.service_catalog);
        }
      }

      if (vm.modalData.resource.dialog) {
        if (!vm.blueprint.ui_properties.service_dialog || vm.modalData.resource.dialog.id
            !== vm.blueprint.ui_properties.service_dialog.id) {
          vm.blueprint.ui_properties.service_dialog = {"id": vm.modalData.resource.dialog.id};
        }
      } else {
        if (vm.blueprint.ui_properties.service_dialog) {
          delete(vm.blueprint.ui_properties.service_dialog);
        }
      }

      vm.blueprint.ui_properties.automate_entrypoints.Provision = vm.modalData.resource.provEP;

      if (vm.modalData.resource.reConfigEP) {
        vm.blueprint.ui_properties.automate_entrypoints.Reconfigure = vm.modalData.resource.reConfigEP;
      } else if (vm.blueprint.ui_properties.automate_entrypoints && vm.blueprint.ui_properties.automate_entrypoints.Reconfigure) {
        vm.blueprint.ui_properties.automate_entrypoints.Reconfigure = null;
      }

      if (vm.modalData.resource.retireEP) {
        vm.blueprint.ui_properties.automate_entrypoints.Retirement = vm.modalData.resource.retireEP;
      } else if (vm.blueprint.ui_properties.automate_entrypoints && vm.blueprint.ui_properties.automate_entrypoints.Retirement) {
        vm.blueprint.ui_properties.automate_entrypoints.Retirement = null;
      }

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
       $log.debug("Orig Blueprint = " + angular.toJson(BlueprintsState.getOriginalBlueprint().ui_properties, true));
       $log.debug("Updated Blueprint = " + angular.toJson(vm.blueprint.ui_properties, true));
       $log.debug("Diff = " + angular.toJson(BlueprintsState.difference(vm.blueprint,
                  BlueprintsState.getOriginalBlueprint()), true));
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

(function() {
  'use strict';

  angular.module('app.components')
    .factory('BlueprintDetailsModal', BlueprintDetailsFactory);

  /** @ngInject */
  function BlueprintDetailsFactory($modal) {
    var modalOpen = false;
    var modalBlueprint = {
      showModal: showModal
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
          tenants: resolveTenants
        }
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
          mock: true,
          expand: 'resources',
          sort_by: 'name',
          sort_options: 'ignore_case'};

        return CollectionsApi.query('service_catalogs', options);
      }

      function resolveServiceDialogs(CollectionsApi) {
        var options = {
          mock: true,
          expand: 'resources',
          attributes: ['id', 'description'],
          sort_by: 'description',
          sort_options: 'ignore_case'};

        return CollectionsApi.query('service_dialogs', options);
      }

      function resolveTenants(CollectionsApi) {
        var options = {
          mock: true,
          expand: 'resources',
          attributes: ['id', 'name'],
          sort_by: 'name',
          sort_options: 'ignore_case'
        };

        return CollectionsApi.query('tenants', options);
      }
    }
  }

  /** @ngInject */
  function BlueprintDetailsModalController(action, blueprint, BlueprintsState, MarketplaceState, serviceCatalogs, serviceDialogs, tenants,     // jshint ignore:line
                                           $state, BrowseEntryPointModal, CreateCatalogModal, $modalInstance, CollectionsApi, Notifications,
                                           sprintf, $filter) {
    var vm = this;
    vm.blueprint = blueprint;

    if (action === 'create') {
      vm.modalTitle = __('Create Blueprint');
      vm.modalBtnPrimaryLabel  = __('Create');
    } else if (action === 'publish') {
      vm.modalTitle = __('Publish ') + vm.blueprint.name;
      vm.modalBtnPrimaryLabel  = __('Publish');
    } else {
      vm.modalTitle = __('Edit Blueprint Details');
      vm.modalBtnPrimaryLabel  = __('Save');
    }

    vm.serviceCatalogs = serviceCatalogs.resources.concat(BlueprintsState.getNewCatalogs());

    vm.serviceDialogs = serviceDialogs.resources;

    vm.visibilityOptions = [{
      id: 800,
      name: 'Private'
    }, {
      id: 900,
      name: 'Public'
    }];
    vm.visibilityOptions = vm.visibilityOptions.concat(tenants.resources);

    vm.saveBlueprintDetails = saveBlueprintDetails;
    vm.cancelBlueprintDetails = cancelBlueprintDetails;
    vm.isCatalogUnassigned = isCatalogUnassigned;
    vm.isCatalogRequired = isCatalogRequired;
    vm.isDialogRequired = isDialogRequired;
    vm.selectEntryPoint = selectEntryPoint;
    vm.createCatalog = createCatalog;
    vm.toggleAdvOps = toggleAdvOps;
    vm.tabClicked = tabClicked;
    vm.isSelectedTab = isSelectedTab;
    vm.dndServiceItemMoved = dndServiceItemMoved;

    vm.modalData = {
      'action': action,
      'resource': {
        'name': vm.blueprint.name || __('Untitled Blueprint ') + BlueprintsState.getNextUniqueId(),
        'visibility': vm.blueprint.visibility,
        'catalog': vm.blueprint.catalog,
        'dialog': vm.blueprint.dialog,
        'provEP':  vm.blueprint.provEP || "path/to/default/prov/entry/point",
        'reConfigEP': vm.blueprint.reConfigEP,
        'retireEP': vm.blueprint.retireEP
      }
    };

    vm.provOrderChanged = false;
    vm.dndModels = getProvisionOrderList(vm.blueprint.chartDataModel.nodes);

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

    activate();

    function activate() {
    }

    function findWithAttr(array, attr, value) {
      for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
          return i;
        }
      }
    }

    function isCatalogUnassigned() {
      return (vm.modalData.resource.catalog === undefined || vm.modalData.resource.catalog === null);
    }

    function isCatalogRequired() {
      return (action === 'publish') && isCatalogUnassigned();
    }

    function isDialogRequired() {
      return (action === 'publish') && (vm.modalData.resource.dialog === undefined || vm.modalData.resource.dialog === null);
    }

    function createCatalog() {
      var modalInstance = CreateCatalogModal.showModal();

      modalInstance.then(function(opts) {
        vm.newCatalog = {"id": BlueprintsState.getNewCatalogs().length, "name": opts.catalogName, "new": 'true'};
        vm.serviceCatalogs.push(vm.newCatalog);
        vm.modalData.resource.catalog = vm.newCatalog;
        $( "#createCatalog" ).blur();
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
      $( "#advOpsHref" ).toggleClass("collapsed");
      $( "#advOps" ).toggleClass("in");
    }

    vm.selectedTabName = "general";

    function tabClicked(tabname) {
      vm.selectedTabName = tabname;
    }

    function isSelectedTab(tabName) {
      return vm.selectedTabName === tabName;
    }

    function cancelBlueprintDetails() {
      $modalInstance.close();
    }

    /**
     * Prov Order List has the following pseudo-structure:
     *
     *   1. Container[0].columns[0][ItemA, ItemB].columns[1][ItemC, ItemD] ]
     *   2. Container[1].columns[0][ItemE, ItemF].columns[1][ItemG, ItemH] ]
     *   etc...
     *
     * This method converts the service items on a blueprint's canvas into a structure
     * required for the DND Prov Order List.
     */
    function getProvisionOrderList(blueprintServiceItems) {
      var items = angular.copy(blueprintServiceItems);
      var containers = [];
      var item;

      // Mark all blueprint service items as type = 'item'
      // Put into appropriate prov. order 'container'
      for (var i = 0; i < items.length; i++) {
        item = items[i];
        item.type = "item";
        if (!item.provision_order) {
          item.provision_order = 0;
        }
        if (containers[item.provision_order]) {
          containers[item.provision_order].columns[0].push(item);
        } else {
          containers[item.provision_order] =
            {
              "type": "container",
              "id": item.provision_order + 1,
              "columns": [
                [item],
                []
              ]
            };
        }
      }

      // remove any undefined containers, balance left and right 'columns' of containers with items
      for (i = 0; i < containers.length; i++) {
        var container = containers[i];
        if (!container) {
          containers.splice(i, 1);
        } else {
          container.columns = balanceColumns(container.columns[0], container.columns[1]);
        }
      }

      // Add last empty row/list #
      addEmptyContainerRow(containers);

      renumberContainersList(containers);

      return {
        selected: null,
        list: containers
      };
    }

    function dndServiceItemMoved(list, index) {
      var container;

      vm.provOrderChanged = true;

      // Remove item from orig. list/column
      list.splice(index, 1);

      // Sort containers by id
      var containers = $filter('orderBy')(vm.dndModels.list, 'id');

      // Remove any empty rows (except last) and balance 'columns'/lists of items
      for (var i = 0; i < containers.length - 1; i++) {
        container = containers[i];
        if (container.type === 'container') {
          if (container.columns[0].length === 0 && container.columns[1].length === 0) {
            // Remove Empty Row
            containers.splice(i, 1);
          } else {
            container.columns = balanceColumns(container.columns[0], container.columns[1]);
          }
        }
      }

      // if last row not empty, add new empty row (list number)
      container = containers[containers.length - 1];
      if (container.type === 'container' && (container.columns[0].length !== 0 || container.columns[1].length !== 0)) {
        addEmptyContainerRow(containers);
      }

      renumberContainersList(containers);

      vm.dndModels.list = containers;
    }

    function addEmptyContainerRow( containers ) {
      containers.push(
          {
            "type": "container",
            "columns": [
              [],
              []
            ]
          }
       );
    }

    function renumberContainersList( containers ) {
      for (var i = 0; i < containers.length; i++) {
        containers[i].id = i + 1;
      }
    }

    function balanceColumns(left, right) {
      var all = left.concat(right);
      // sort all items in container alphabetically by name
      all = $filter('orderBy')(all, 'name');
      left = [];
      right = [];

      for (var i = 0; i < all.length; i += 1) {
        if ( isEven(i) ) {
          left.push(all[i]);
        } else {
          right.push(all[i]);
        }
      }

      return [left, right];
    }

    function isEven(n) {
      return n % 2 === 0;
    }

    function saveBlueprintDetails() {   // jshint ignore:line
      // Save any new catalogs
      for (var i = 0; i < vm.serviceCatalogs.length; i += 1) {
        if (vm.serviceCatalogs[i].new) {
          vm.serviceCatalogs[i].new = null;
          BlueprintsState.addNewCatalog(vm.serviceCatalogs[i]);
        }
      }

      vm.blueprint.name = vm.modalData.resource.name;

      if (!vm.blueprint.visibility || (vm.blueprint.visibility.id.toString() !== vm.modalData.resource.visibility.id.toString())) {
        vm.blueprint.visibility = vm.modalData.resource.visibility;
      }

      if (!vm.blueprint.catalog || !vm.modalData.resource.catalog ||
          (vm.blueprint.catalog.id.toString() !== vm.modalData.resource.catalog.id.toString())) {
        vm.blueprint.catalog = vm.modalData.resource.catalog;
      }

      if (!vm.blueprint.dialog || !vm.modalData.resource.dialog ||
          (vm.blueprint.dialog.id.toString() !== vm.modalData.resource.dialog.id.toString())) {
        vm.blueprint.dialog = vm.modalData.resource.dialog;
      }

      vm.blueprint.provEP = vm.modalData.resource.provEP;
      vm.blueprint.reConfigEP = vm.modalData.resource.reConfigEP;
      vm.blueprint.retireEP = vm.modalData.resource.retireEP;

      if (vm.provOrderChanged) {
        saveProvisionOrder();
      }

      if (action === 'publish') {
        vm.blueprint.published = new Date();
        MarketplaceState.publishBlueprint(vm.blueprint);
      } else if (action === 'create') {
        vm.blueprint.chartDataModel = {};
      }

      saveSuccess();

      function saveProvisionOrder() {
        for (var i = 0; i < vm.dndModels.list.length; i++) {
          var container = vm.dndModels.list[i];
          if (container.type === 'container') {
            var srvItems = container.columns[0].concat(container.columns[1]);
            for (var j = 0; j < srvItems.length; j++) {
              var srvItem = srvItems[j];
              updateServiceItemProvOrder(srvItem, container.id - 1);
            }
          }
        }
      }

      function updateServiceItemProvOrder(srvItem, provOrderNum) {
        for (var i = 0; i < vm.blueprint.chartDataModel.nodes.length; i++) {
          var node = vm.blueprint.chartDataModel.nodes[i];
          if (node.id === srvItem.id && node.name === srvItem.name) {
            node.provision_order = provOrderNum;

            return;
          }
        }
      }

      function saveSuccess() {
        Notifications.success(sprintf(__('%s was created.'), vm.blueprint.name));
        if (action === 'create') {
          $modalInstance.close();
          BlueprintsState.saveBlueprint(vm.blueprint);
          $state.go('blueprints.designer', {blueprintId: vm.blueprint.id});
        } else if (action === 'edit') {
          Notifications.success(sprintf(__('%s was updated.'), vm.blueprint.name));
          $modalInstance.close({editedblueprint: vm.blueprint});
          Notifications.success(sprintf(__('%s was updated.'), vm.blueprint.name));
        } else if (action === 'publish') {
          $modalInstance.close();
          Notifications.success(sprintf(__('%s was published.'), vm.blueprint.name));
          $state.go($state.current, {}, {reload: true});
        }
      }

      function saveFailure() {
        Notifications.error(__('There was an error saving this Blueprint.'));
      }
    }
  }
})();

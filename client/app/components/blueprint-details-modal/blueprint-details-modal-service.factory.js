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

    function showModal(action, blueprintId) {
      var modalOptions = {
        templateUrl: 'app/components/blueprint-details-modal/blueprint-details-modal.html',
        controller: BlueprintDetailsModalController,
        controllerAs: 'vm',
        resolve: {
          action: resolveAction,
          blueprintId: resolveBlueprintId,
          serviceCatalogs: resolveServiceCatalogs,
          serviceDialogs: resolveServiceDialogs,
          tenants: resolveTenants
        }
      };

      var modal = $modal.open(modalOptions);

      return modal.result;

      function resolveBlueprintId() {
        return blueprintId;
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
  function BlueprintDetailsModalController(action, blueprintId, BlueprintsState, jQuery, serviceCatalogs, serviceDialogs, tenants, $state, // jshint ignore:line
                                           $modalInstance, CollectionsApi, Notifications, sprintf) { // jshint ignore:line
    var vm = this;

    if (action === 'create') {
      vm.modalTitle = __('Create Blueprint');
      vm.modalBtnPrimaryLabel  = __('Create');
    } else {
      vm.modalTitle = __('Edit Blueprint Details');
      vm.modalBtnPrimaryLabel  = __('Save');
    }

    vm.blueprint = BlueprintsState.getBlueprintById(blueprintId);

    vm.serviceCatalogs = serviceCatalogs.resources;
    vm.serviceCatalogs.splice(0, 0, {id: -1, name: __('Unassigned')});

    vm.serviceDialogs = serviceDialogs.resources;
    vm.serviceDialogs.splice(0, 0, {id: -1, description: __('Select Dialog')});

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
    vm.isUnassigned = isUnassigned;
    vm.catalogChanged = catalogChanged;

    vm.modalData = {
      'action': action,
      'resource': {
        'name': vm.blueprint.name || __('Untitled Catalog ') + BlueprintsState.getNextUniqueId(),
        'visibility': vm.blueprint.visibility,
        'catalog': vm.blueprint.catalog,
        'dialog': vm.blueprint.dialog,
        'provEP':  vm.blueprint.provEP,
        'reConfigEP': vm.blueprint.reConfigEP,
        'retireEP': vm.blueprint.retireEP
      }
    };

    if (!vm.modalData.resource.visibility) {
      vm.modalData.resource.visibility = vm.visibilityOptions[0];
    } else {
      vm.modalData.resource.visibility = vm.visibilityOptions[
            findWithAttr(vm.visibilityOptions, 'id', vm.modalData.resource.visibility.id)
          ];
    }

    if (!vm.modalData.resource.catalog) {
      vm.modalData.resource.catalog = vm.serviceCatalogs[0];
    } else {
      vm.modalData.resource.catalog = vm.serviceCatalogs[ findWithAttr(vm.serviceCatalogs, 'id', vm.modalData.resource.catalog.id) ];
    }

    if (!vm.modalData.resource.dialog) {
      vm.modalData.resource.dialog = vm.serviceDialogs[0];
    } else {
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

    function isUnassigned() {
      return vm.modalData.resource.catalog === vm.serviceCatalogs[0];
    }

    function catalogChanged() {
      if (isUnassigned()) {
        vm.modalData.resource.provEP = '';
        vm.modalData.resource.reConfigEP = '';
        vm.modalData.resource.retireEP = '';
        jQuery('#advOps').removeClass('in');
        jQuery('#advOpsHref').toggleClass('collapsed');
      }
    }

    function cancelBlueprintDetails() {
      $modalInstance.close();
      $state.go($state.current, {}, {reload: true});
    }

    function saveBlueprintDetails() {
      vm.blueprint.id = blueprintId;
      vm.blueprint.name = vm.modalData.resource.name;

      vm.blueprint.visibility = vm.modalData.resource.visibility;
      vm.blueprint.catalog = vm.modalData.resource.catalog;
      vm.blueprint.dialog = vm.modalData.resource.dialog;

      vm.blueprint.provEP = vm.modalData.resource.provEP;
      vm.blueprint.reConfigEP = vm.modalData.resource.reConfigEP;
      vm.blueprint.retireEP = vm.modalData.resource.retireEP;

      BlueprintsState.saveBlueprint(vm.blueprint);
      saveSuccess();

      function saveSuccess() {
        $modalInstance.close();
        if (action === 'create') {
          Notifications.success(sprintf(__('%s was created.'), vm.blueprint.name));
          $state.go('blueprints.designer', {blueprintId: vm.blueprint.id});
        } else if (action === 'edit') {
          Notifications.success(sprintf(__('%s was updated.'), vm.blueprint.name));
          $state.go($state.current, {}, {reload: true});
        }
      }

      function saveFailure() {
        Notifications.error(__('There was an error saving this Blueprint.'));
      }
    }
  }
})();

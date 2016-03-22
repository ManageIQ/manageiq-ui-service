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

    function showModal(blueprintId) {
      var modalOptions = {
        templateUrl: 'app/components/blueprint-details-modal/blueprint-details-modal.html',
        controller: BlueprintDetailsModalController,
        controllerAs: 'vm',
        resolve: {
          blueprintId: resolveBlueprintId,
          serviceCatalogs: resolveServiceCatalogs,
          serviceDialogs: resolveServiceDialogs
        }
      };

      var modal = $modal.open(modalOptions);

      return modal.result;

      function resolveBlueprintId() {
        return blueprintId;
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
          attributes: ['id', 'description'],
          sort_by: 'description',
          sort_options: 'ignore_case'};

        return CollectionsApi.query('service_dialogs', options);
      }
    }
  }

  /** @ngInject */
  function BlueprintDetailsModalController(blueprintId, BlueprintsState, jQuery, serviceCatalogs, serviceDialogs, $state, $modalInstance, CollectionsApi, Notifications) {
    var vm = this;

    vm.blueprint = BlueprintsState.getBlueprintById(blueprintId);
    vm.serviceCatalogs = serviceCatalogs.resources;
    vm.serviceCatalogs.splice(0, 0, {id: "-1", name: __('Do Not Display')});

    //console.log("Dialogs = " + JSON.stringify(serviceDialogs.resources,null,2));

    vm.dialogOptions = [];
    angular.forEach(serviceDialogs.resources, addServiceDialogOption);
    vm.dialogOptions.splice(0, 0, {id: "-1", name: __('Select Dialog')});

    vm.saveBlueprintDetails = saveBlueprintDetails;
    vm.cancelBlueprintDetails = cancelBlueprintDetails;
    vm.isDoNotDisplayInCatalog = isDoNotDisplayInCatalog;
    vm.catalogChanged = catalogChanged;

    vm.modalData = {
      'action': 'edit',
      'resource': {
        'name': vm.blueprint.name || '',
        'visibility': vm.blueprint.visibility,
        'catalog': vm.blueprint.catalog,
        'dialog': vm.blueprint.dialog,
        'provEP':  vm.blueprint.provEP,
        'reConfigEP': vm.blueprint.reConfigEP,
        'retireEP': vm.blueprint.retireEP
      }
    };

    vm.visibilityOptions = [{
      id: 100,
      label: 'Private'
    }, {
      id: 101,
      label: 'Public'
    }, {
      id: 102,
      label: 'Tenant'
    }];

    if(vm.modalData.resource.visibility == null){
      vm.modalData.resource.visibility = vm.visibilityOptions[0];
    } else {
      vm.modalData.resource.visibility = vm.visibilityOptions[ findWithAttr(vm.visibilityOptions, 'id', vm.modalData.resource.visibility) ];
    }

    if(vm.modalData.resource.catalog == null){
      vm.modalData.resource.catalog = vm.serviceCatalogs[0];
    } else {
      vm.modalData.resource.catalog = vm.serviceCatalogs[ findWithAttr(vm.serviceCatalogs, 'id', vm.modalData.resource.catalog) ];
    }

    if(vm.modalData.resource.dialog == null){
      vm.modalData.resource.dialog = vm.dialogOptions[0];
    } else {
      vm.modalData.resource.dialog = vm.dialogOptions[ findWithAttr(vm.dialogOptions, 'id', vm.modalData.resource.dialog) ];
    }

    activate();

    function activate() {
    }

    function findWithAttr(array, attr, value) {
      for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
          return i;
        }
      }
    }

    function isDoNotDisplayInCatalog() {
      return vm.modalData.resource.catalog == vm.serviceCatalogs[0];
    }

    function catalogChanged() {
      if(isDoNotDisplayInCatalog()){
        vm.modalData.resource.provEP = '';
        vm.modalData.resource.reConfigEP = '';
        vm.modalData.resource.retireEP = '';
        jQuery('#advOps').removeClass('in');
        jQuery('#advOpsHref').toggleClass('collapsed');
      }
    }

    function addServiceDialogOption(dialog) {
      var tmpObj = {id: dialog.id, label: dialog.description};
      vm.dialogOptions.push(tmpObj);
    }

    function cancelBlueprintDetails() {
      $modalInstance.close();
      $state.go($state.current, {}, {reload: true});
    }

    function saveBlueprintDetails() {
      //CollectionsApi.post('Blueprints', vm.Blueprint.id, {}, vm.modalData).then(saveSuccess, saveFailure);

      vm.blueprint.name = vm.modalData.resource.name;
      vm.blueprint.visibility = vm.modalData.resource.visibility.id;
      vm.blueprint.catalog = vm.modalData.resource.catalog.id;
      vm.blueprint.dialog = vm.modalData.resource.dialog.id;
      vm.blueprint.provEP = vm.modalData.resource.provEP;
      vm.blueprint.reConfigEP = vm.modalData.resource.reConfigEP;
      vm.blueprint.retireEP = vm.modalData.resource.retireEP;

      BlueprintsState.saveBlueprint(vm.blueprint);
      saveSuccess();

      function saveSuccess() {
        $modalInstance.close();
        Notifications.success(vm.blueprint.name + __(' was edited.'));
        $state.go($state.current, {}, {reload: true});
      }

      function saveFailure() {
        Notifications.error(__('There was an error editing this Blueprint.'));
      }
    }
  }
})();

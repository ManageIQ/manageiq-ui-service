(function() {
  'use strict';

  angular.module('app.components')
    .factory('SaveBlueprintModal', SaveBlueprintFactory);

  /** @ngInject */
  function SaveBlueprintFactory($modal) {
    var modalOpen = false;
    var modalSaveBlueprint = {
      showModal: showModal
    };

    return modalSaveBlueprint;

    function showModal(blueprint, toState, toParams, fromState, fromParams) {
      var modalOptions = {
        templateUrl: 'app/states/blueprints/designer/save-blueprint-modal.html',
        controller: SaveBlueprintModalController,
        controllerAs: 'vm',
        resolve: {
          blueprint: blueprint,
          toState: toState,
          toParams: toParams,
          fromState: fromState,
          fromParams: fromParams
        }
      };
      var modal = $modal.open(modalOptions);

      return modal.result;
    }
  }

  /** @ngInject */
  function SaveBlueprintModalController(blueprint, toState, toParams, fromState, fromParams, $state, $modalInstance, BlueprintsState, Notifications) {
    var vm = this;
    vm.blueprint = blueprint;
    vm.save = save;
    vm.doNotSave = doNotSave;

    function save() {
      BlueprintsState.saveBlueprint(blueprint);
      saveSuccess();

      function saveSuccess() {
        $modalInstance.close();
        Notifications.success(vm.blueprint.name + __(' was saved.'));
        fromState.okToNavAway = true;
        $state.go(toState, toParams);
      }

      function saveFailure() {
        console.log("Failed to save blueprint.");
      }
    }

    function doNotSave() {
      $modalInstance.close();
      fromState.okToNavAway = true;
      $state.go(toState, toParams);
    }
  }
})();

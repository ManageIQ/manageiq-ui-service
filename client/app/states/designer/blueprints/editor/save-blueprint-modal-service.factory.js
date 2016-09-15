(function() {
  'use strict';

  angular.module('app.components')
    .factory('SaveBlueprintModal', SaveBlueprintFactory);

  /** @ngInject */
  function SaveBlueprintFactory($modal) {
    var modalOpen = false;
    var modalSaveBlueprint = {
      showModal: showModal,
    };

    return modalSaveBlueprint;

    function showModal(blueprint, toState, toParams, fromState, fromParams) {
      var modalOptions = {
        templateUrl: 'app/states/designer/blueprints/editor/save-blueprint-modal.html',
        controller: SaveBlueprintModalController,
        controllerAs: 'vm',
        resolve: {
          blueprint: blueprint,
          toState: toState,
          toParams: toParams,
          fromState: fromState,
          fromParams: fromParams,
        },
      };
      var modal = $modal.open(modalOptions);

      return modal.result;
    }
  }

  /** @ngInject */
  function SaveBlueprintModalController(blueprint, toState, toParams, fromState, fromParams, $state, $modalInstance, BlueprintsState) {
    var vm = this;
    vm.blueprint = blueprint;
    vm.save = save;
    vm.doNotSave = doNotSave;

    function save() {
      BlueprintsState.saveBlueprint(blueprint).then(saveSuccess, saveFailure);

      function saveSuccess() {
        $modalInstance.close();
        BlueprintsState.setDoNotSave(false);
        BlueprintsState.saveOriginalBlueprint(angular.copy(blueprint));
        $state.go(toState, toParams);
      }

      function saveFailure() {
        console.log("Failed to nav away and save blueprint.");
        $modalInstance.close();
      }
    }

    function doNotSave() {
      $modalInstance.close();
      BlueprintsState.setDoNotSave(true);
      $state.go(toState, toParams);
    }
  }
})();

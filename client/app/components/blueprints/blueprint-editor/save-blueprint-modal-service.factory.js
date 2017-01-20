/** @ngInject */
export function SaveBlueprintFactory($uibModal) {
  var modalSaveBlueprint = {
    showModal: showModal,
  };

  return modalSaveBlueprint;

  function showModal(blueprint, toState, toParams, fromState, fromParams) {
    var modalOptions = {
      templateUrl: 'app/components/blueprints/blueprint-editor/save-blueprint-modal.html',
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
    var modal = $uibModal.open(modalOptions);

    return modal.result;
  }
}

/** @ngInject */
function SaveBlueprintModalController(blueprint, toState, toParams, fromState, fromParams, $state, $uibModalInstance, $log,
                                      BlueprintsState) {
  var vm = this;
  vm.blueprint = blueprint;
  vm.save = save;
  vm.doNotSave = doNotSave;

  function save() {
    BlueprintsState.saveBlueprint(blueprint).then(saveSuccess, saveFailure);

    function saveSuccess() {
      $uibModalInstance.close();
      BlueprintsState.setDoNotSave(false);
      BlueprintsState.saveOriginalBlueprint(angular.copy(blueprint));
      $state.go(toState, toParams);
    }

    function saveFailure() {
      $log.error("Failed to nav away and save blueprint.");
      $uibModalInstance.close();
    }
  }

  function doNotSave() {
    $uibModalInstance.close();
    BlueprintsState.setDoNotSave(true);
    $state.go(toState, toParams);
  }
}

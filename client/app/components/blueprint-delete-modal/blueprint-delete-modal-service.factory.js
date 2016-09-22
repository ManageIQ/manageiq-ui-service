(function() {
  'use strict';

  angular.module('app.components')
    .factory('BlueprintDeleteModal', BlueprintDeleteFactory);

  /** @ngInject */
  function BlueprintDeleteFactory($modal) {
    var modalBlueprint = {
      showModal: showModal,
    };

    return modalBlueprint;

    function showModal(blueprints) {
      var modalOptions = {
        templateUrl: 'app/components/blueprint-delete-modal/blueprint-delete-modal.html',
        controller: BlueprintDeleteModalController,
        controllerAs: 'vm',
        resolve: { blueprints: resolveBlueprints },
      };

      var modal = $modal.open(modalOptions);

      return modal.result;

      function resolveBlueprints() {
        return blueprints;
      }
    }
  }

  /** @ngInject */
  function BlueprintDeleteModalController(blueprints, BlueprintsState, $state, $modalInstance, $log, CollectionsApi) {
    var vm = this;

    vm.blueprintsList = blueprints;
    vm.deleteBlueprints = deleteBlueprints;

    activate();

    function activate() {
    }

    function deleteBlueprints() {
      BlueprintsState.deleteBlueprints(blueprints).then(deleteSuccess, deleteFailure);

      function deleteSuccess() {
        $modalInstance.close();
        $state.go($state.current, {}, {reload: true});
      }

      function deleteFailure() {
        $log.error("Failed to delete blueprint(s).");
        $modalInstance.close();
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .factory('BlueprintDeleteModal', BlueprintDeleteFactory);

  /** @ngInject */
  function BlueprintDeleteFactory($modal) {
    var modalOpen = false;
    var modalBlueprint = {
      showModal: showModal
    };

    return modalBlueprint;

    function showModal(blueprints) {
      var modalOptions = {
        templateUrl: 'app/components/blueprint-delete-modal/blueprint-delete-modal.html',
        controller: BlueprintDeleteModalController,
        controllerAs: 'vm',
        resolve: { blueprints: resolveBlueprints }
      };

      var modal = $modal.open(modalOptions);

      return modal.result;

      function resolveBlueprints() {
        return blueprints;
      }
    }
  }

  /** @ngInject */
  function BlueprintDeleteModalController(blueprints, BlueprintsState, $state, $modalInstance, CollectionsApi, Notifications) {
    var vm = this;

    vm.blueprintsList = blueprints;

    if (vm.blueprintsList.length === 1) {
      vm.delBlueprintsLabel = vm.blueprintsList[0].name + __('?');
    } else {
      vm.delBlueprintsLabel = vm.blueprintsList.length + ' ' + __('blueprints?');
    }

    vm.deleteBlueprints = deleteBlueprints;

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

    function deleteBlueprints() {
      angular.forEach(vm.blueprintsList, deleteBlueprint);

      function deleteBlueprint(blueprint) {
        BlueprintsState.deleteBlueprint(blueprint.id);
      }

      BlueprintsState.unselectBlueprints();
      saveSuccess();

      function saveSuccess() {
        $modalInstance.close();
        Notifications.success(__('Blueprint(s) deleted.'));
        $state.go($state.current, {}, {reload: true});
      }

      function saveFailure() {
        Notifications.error(__('There was an error deleting Blueprints.'));
      }
    }
  }
})();

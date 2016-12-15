(function() {
  'use strict';

  angular.module('app.components')
    .factory('SaveModalDialog', SaveModalDialogFactory);

  /** @ngInject */
  function SaveModalDialogFactory($uibModal) {
    var modalSaveDialog = {
      showModal: showModal,
    };

    return modalSaveDialog;

    function showModal(saveCallback, doNotSaveCallback, cancelCallback, okToSave) {
      var modalOptions = {
        templateUrl: 'app/components/save-modal-dialog/save-modal-dialog.html',
        controller: SaveModalDialogController,
        controllerAs: 'vm',
        resolve: {
          saveCallback: resolveSave,
          doNotSaveCallback: resolveDoNotSave,
          cancelCallback: resolveCancel,
          okToSave: resolveOkToSave,
        },
      };

      function resolveSave() {
        return saveCallback;
      }

      function resolveDoNotSave() {
        return doNotSaveCallback;
      }

      function resolveCancel() {
        return cancelCallback;
      }
      function resolveOkToSave() {
        return okToSave;
      }
      var modal = $uibModal.open(modalOptions);

      return modal.result;
    }
  }

  /** @ngInject */
  function SaveModalDialogController(saveCallback, doNotSaveCallback, cancelCallback, okToSave, $uibModalInstance) {
    var vm = this;
    vm.save = save;
    vm.doNotSave = doNotSave;
    vm.cancel = cancel;
    vm.okToSave = okToSave;

    function save() {
      saveCallback();
      $uibModalInstance.close();
    }

    function doNotSave() {
      doNotSaveCallback();
      $uibModalInstance.close();
    }

    function cancel() {
      cancelCallback();
      $uibModalInstance.close();
    }
  }
})();

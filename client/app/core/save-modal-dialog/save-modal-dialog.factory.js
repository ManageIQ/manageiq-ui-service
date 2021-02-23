import template from './save-modal-dialog.html';

/** @ngInject */
export function SaveModalDialogFactory ($uibModal) {
  var modalSaveDialog = {
    showModal: showModal
  }

  return modalSaveDialog

  function showModal (saveCallback, cancelCallback, okToSave) {
    var modalOptions = {
      template,
      controller: SaveModalDialogController,
      controllerAs: 'vm',
      resolve: {
        saveCallback: resolveSave,
        cancelCallback: resolveCancel,
        okToSave: resolveOkToSave
      }
    }

    function resolveSave () {
      return saveCallback
    }

    function resolveCancel () {
      return cancelCallback
    }

    function resolveOkToSave () {
      return okToSave
    }

    var modal = $uibModal.open(modalOptions)

    return modal.result
  }
}

/** @ngInject */
function SaveModalDialogController (saveCallback, cancelCallback, okToSave, $uibModalInstance) {
  const vm = this
  vm.save = save
  vm.cancel = cancel
  vm.okToSave = okToSave

  function save () {
    saveCallback()
    $uibModalInstance.close()
  }

  function cancel () {
    cancelCallback()
    $uibModalInstance.close()
  }
}

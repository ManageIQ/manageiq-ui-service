import templateUrl from './modal-actions.html';

export const ModalActionsComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    modalData: '<?',
    confirmationModal: '<?',
    customButton: '<?',
    resetModal: '<?',
    onCancel: '&',
    onReset: '&',
    onSave: '&',
    onOk: '&',
    onCustomButton: '&',
  },
  templateUrl,
};

/** @ngInject */
function ComponentController(sprintf) {
  var vm = this;

  angular.extend(vm, {
    customButtonTranslated: sprintf(__("%s"), vm.customButton),
    isPristine: isPristine,
    cancelAction: cancelAction,
    emitOriginal: emitOriginal,
    saveResource: saveResource,
    affirmConfirmation: affirmConfirmation,
    customButtonAction: customButtonAction,
  });


  vm.$onInit = function() {
    vm.original = angular.copy(vm.modalData);
  };

  function cancelAction() {
    vm.onCancel();
  }

  function isPristine() {
    return angular.equals(vm.modalData, vm.original);
  }

  function emitOriginal() {
    vm.onReset({
      $event: {
        original: vm.original,
      },
    });
  }

  function saveResource() {
    vm.onSave();
  }

  function affirmConfirmation() {
    vm.onOk();
  }

  function customButtonAction() {
    vm.onCustomButton();
  }
}

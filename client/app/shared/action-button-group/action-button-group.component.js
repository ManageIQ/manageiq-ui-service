import templateUrl from './action-button-group.html';

export const ActionButtonGroupComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    modalData: '<?',
    confirmationModal: '<?',
    customButton: '<?',
    resetModal: '<?',
    isDisabled: '<?',
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
  const vm = this;


  vm.$onInit = function() {
    angular.extend(vm, {
      isDisabled: angular.isUndefined(vm.isDisabled) ? false : vm.isDisabled,
      customButtonTranslated: sprintf(__("%s"), vm.customButton),
      isPristine: isPristine,
      cancelAction: cancelAction,
      emitOriginal: emitOriginal,
      saveResource: saveResource,
      affirmConfirmation: affirmConfirmation,
      customButtonAction: customButtonAction,
    })
    ;

    vm.original = angular.copy(vm.modalData);
  };

  vm.$onChanges = function(changes) {
    if (angular.isDefined(changes.isDisabled)) {
      vm.isDisabled = changes.isDisabled.currentValue;
    }
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

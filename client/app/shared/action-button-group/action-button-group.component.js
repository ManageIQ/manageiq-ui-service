import template from './action-button-group.html';

export const ActionButtonGroupComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    data: '<?',
    actionConfirmation: '<?',
    customButton: '<?',
    resetButton: '<?',
    isDisabled: '<?',
    isInverted: '<?',
    onCancel: '&',
    onReset: '&',
    onSave: '&',
    onSaveLabel: '@',
    onOk: '&',
    onCustomButton: '&'
  },
  template,
}

/** @ngInject */
function ComponentController (sprintf) {
  const vm = this

  vm.$onInit = function () {
    angular.extend(vm, {
      isDisabled: angular.isUndefined(vm.isDisabled) ? false : vm.isDisabled,
      onSaveLabel: angular.isUndefined(vm.onSaveLabel) ? __('Save') : vm.onSaveLabel,
      isInverted: angular.isUndefined(vm.isInverted) ? false : vm.isInverted,
      customButtonTranslated: sprintf(__('%s'), vm.customButton),
      isPristine: isPristine,
      cancelAction: cancelAction,
      emitOriginal: emitOriginal,
      saveResource: saveResource,
      affirmConfirmation: affirmConfirmation,
      customButtonAction: customButtonAction
    })
    vm.original = angular.copy(vm.data)
  }

  vm.$onChanges = function (changes) {
    if (angular.isDefined(changes.isDisabled)) {
      vm.isDisabled = changes.isDisabled.currentValue
    }
  }

  function cancelAction () {
    vm.onCancel()
  }

  function isPristine () {
    return angular.equals(vm.data, vm.original)
  }

  function emitOriginal () {
    vm.onReset({
      $event: {
        original: vm.original
      }
    })
  }

  function saveResource () {
    vm.onSave()
  }

  function affirmConfirmation () {
    vm.onOk()
  }

  function customButtonAction () {
    vm.onCustomButton()
  }
}

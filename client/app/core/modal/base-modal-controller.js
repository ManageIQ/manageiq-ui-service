/** @ngInject */
export function BaseModalController ($uibModalInstance, $state, CollectionsApi, EventNotifications) {
  const vm = this
  vm.cancel = cancel
  vm.reset = reset
  vm.save = save

  function cancel () {
    $uibModalInstance.dismiss()
  }

  function reset (event) {
    angular.copy(event.original, this.modalData) // eslint-disable-line angular/controller-as-vm
  }

  function save () {
    const vm = this
    var data = {
      action: vm.action,
      resource: vm.modalData
    }

    CollectionsApi.post(vm.collection, vm.modalData.id, {}, data).then(saveSuccess, saveFailure)

    function saveSuccess () {
      $uibModalInstance.close()
      EventNotifications.success(vm.onSuccessMessage)
      $state.go($state.current, {}, {reload: true})
    }

    function saveFailure () {
      EventNotifications.error(vm.onFailureMessage)
    }
  }
}

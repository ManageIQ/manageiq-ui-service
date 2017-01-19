export const RetireRemoveServiceModalComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&',
  },
  templateUrl: 'app/components/retire-remove-service-modal/retire-remove-service-modal.html',
};

/** @ngInject */
function ComponentController($state, CollectionsApi, EventNotifications) {
  var vm = this;

  angular.extend(vm, {
    services: vm.resolve.services,
    isRemove: vm.resolve.modalType === "remove",
    isRetireNow: vm.resolve.modalType === "retire",
    confirm: confirm,
    cancel: cancel,
  });

  function cancel() {
    vm.dismiss({$value: 'cancel'});
  }

  function confirm() {
    var data = {
      action: vm.isRemove ? 'delete' : 'retire',
      resources: vm.services,
    };
    CollectionsApi.post('services', '', {}, data).then(saveSuccess, saveFailure);

    function saveSuccess() {
      vm.close();
      switch (vm.resolve.modalType) {
        case "retire":
          EventNotifications.success(__("Services Retired"));
          break;
        case "remove":
          EventNotifications.success(__("Services Removed"));
          break;
      }
      $state.go($state.current, {}, {reload: true});
    }

    function saveFailure() {
      EventNotifications.error(__('There was an error removing one or more services.'));
    }
  }
}

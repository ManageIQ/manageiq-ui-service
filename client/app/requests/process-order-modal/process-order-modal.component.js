import templateUrl from './process-order-modal.html';

export const ProcessOrderModalComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&',
  },
  templateUrl,
};

/** @ngInject */
function ComponentController($state, sprintf, CollectionsApi, EventNotifications) {
  var vm = this;

  angular.extend(vm, {
    order: vm.resolve.order,
    confirm: confirm,
    cancel: cancel,
  });

  function cancel() {
    vm.dismiss({$value: 'cancel'});
  }

  function confirm() {
    var data = {
      action: 'delete',
      resources: [vm.order],
    };
    CollectionsApi.post('service_orders', '', {}, data).then(saveSuccess, saveFailure);

    function saveSuccess() {
      vm.close();
      EventNotifications.success(sprintf(__('%s was deleted.'), vm.order.name));
      $state.go($state.current, {}, {reload: true});
    }

    function saveFailure() {
      EventNotifications.error(sprintf(__('There was an error deleting %s.'), vm.order.name));
    }
  }
}

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
function ComponentController($state, CollectionsApi, EventNotifications, ActionNotifications) {
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

    function saveSuccess(response) {
      vm.close();
      ActionNotifications.add(response, __('Deleting order.'), __('Error deleting order.'));
      $state.go($state.current, {}, {reload: true});
    }

    function saveFailure() {
      EventNotifications.error(__('There was an error removing order'));
    }
  }
}

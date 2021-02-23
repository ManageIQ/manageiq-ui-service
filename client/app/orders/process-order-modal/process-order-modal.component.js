import template from './process-order-modal.html';

export const ProcessOrderModalComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  },
  template,
}

/** @ngInject */
function ComponentController ($state, CollectionsApi, EventNotifications) {
  const vm = this

  vm.$onInit = () => {
    angular.extend(vm, {
      order: vm.resolve.order,
      confirm: confirm,
      cancel: cancel
    })
  }

  function cancel () {
    vm.dismiss({$value: 'cancel'})
  }

  function confirm () {
    var data = {
      action: 'delete',
      resources: [vm.order]
    }
    CollectionsApi.post('service_orders', '', {}, data).then(saveSuccess, saveFailure)

    function saveSuccess (response) {
      vm.close()
      EventNotifications.batch(response.results, __('Deleting order.'), __('Error deleting order.'))
      $state.go($state.current, {}, {reload: true})
    }

    function saveFailure () {
      EventNotifications.error(__('There was an error removing order'))
    }
  }
}

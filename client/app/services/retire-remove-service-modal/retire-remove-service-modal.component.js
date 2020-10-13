import template from './retire-remove-service-modal.html';

export const RetireRemoveServiceModalComponent = {
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

  vm.$onInit = function () {
    angular.extend(vm, {
      services: vm.resolve.services,
      isRemove: vm.resolve.modalType === 'remove',
      isRetireNow: vm.resolve.modalType === 'retire',
      confirm: confirm,
      cancel: cancel
    })
  }

  function cancel () {
    vm.dismiss({$value: 'cancel'})
  }

  function confirm () {
    var data = {
      action: vm.isRemove ? 'delete' : 'request_retire',
      resources: vm.services
    }
    CollectionsApi.post('services', '', {}, data).then(saveSuccess, saveFailure)

    function saveSuccess (response) {
      vm.close()
      switch (vm.resolve.modalType) {
        case 'retire':
          EventNotifications.success(__('Service Retire - Request Created'))
          break
        case 'remove':
          EventNotifications.batch(response.results, __('Service deleting.'), __('Error deleting service.'))
          break
      }
      $state.go($state.current, {}, {reload: true})
    }

    function saveFailure () {
      EventNotifications.error(__('There was an error removing one or more services.'))
    }
  }
}

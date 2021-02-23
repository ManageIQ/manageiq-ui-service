import template from './retire-service-modal.html';

export const RetireServiceModalComponent = {
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
function ComponentController ($scope, $state, CollectionsApi, EventNotifications, moment) {
  const vm = this

  vm.$onInit = function () {
    angular.extend(vm, {
      visibleOptions: [],
      modalData: {},
      isService: vm.resolve.services.length === 1,
      resetModal: false,
      services: vm.resolve.services,
      save: save,
      reset: reset,
      cancel: cancel
    })

    vm.dateOptions = {
      initDate: new Date(),
      minDate: new Date(),
      showWeeks: false
    }

    vm.warningOptions = [
      {value: 0, label: __('No Warning')},
      {value: 7, label: __('1 Week')},
      {value: 14, label: __('2 Weeks')},
      {value: 21, label: __('3 Weeks')},
      {value: 28, label: __('4 Weeks')}
    ]

    if (vm.isService) {
      vm.modalData.id = vm.services[0].id
      vm.resetModal = true
      var existingDate = new Date(vm.services[0].retires_on)
      var existingUTCDate = new Date(existingDate.getTime() + existingDate.getTimezoneOffset() * 60000)
      vm.modalData.date = vm.services[0].retires_on ? existingUTCDate : null
      vm.modalData.warn = vm.services[0].retirement_warn || 0
    }

    $scope.$watch('vm.modalData.date', function (date) {
      var daysBetween = moment(date).diff(moment(), 'days')

      vm.visibleOptions = vm.warningOptions.filter(function (option) {
        return option.value <= daysBetween
      })
    })
  }

  function save () {
    var data = {
      action: 'retire',
      resources: vm.services.map(setRetire)
    }

    CollectionsApi.post('services', '', {}, data).then(saveSuccess, saveFailure)

    function saveSuccess () {
      vm.close()
      EventNotifications.success(__('Scheduling retirement.'))
      $state.go($state.current, {}, {reload: true})
    }

    function saveFailure () {
      EventNotifications.error(__('There was an error retiring this service.'))
    }

    function setRetire (service) {
      const copy = angular.copy(service)
      copy.date = vm.modalData.date || ''
      copy.warn = vm.modalData.warn

      return copy
    }
  }

  function cancel () {
    vm.dismiss({$value: 'cancel'})
  }

  function reset (event) {
    angular.copy(event.original, this.modalData) // eslint-disable-line angular/controller-as-vm
  }
}

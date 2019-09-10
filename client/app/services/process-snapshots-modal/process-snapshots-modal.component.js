import templateUrl from './process-snapshots-modal.html'

export const ProcessSnapshotsModalComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    resolve: '<',
    modalInstance: '<',
    close: '&',
    dismiss: '&'
  },
  templateUrl
}

/** @ngInject */
function ComponentController ($controller, $state, EventNotifications, VmsService) {
  const vm = this

  vm.$onInit = function () {
    angular.extend(vm, $controller('BaseModalController', {
      $uibModalInstance: vm.modalInstance
    }))

    angular.extend(vm, {
      modalData: {},
      vm: vm.resolve.vm,
      modalType: vm.resolve.modalType,
      save: save
    })

    vm.nameLabel = __('Name')
    vm.descriptionLabel = __('Description')

    vm.nameLabelClass = 'col-sm-3'
    vm.descriptionLabelClass = 'col-sm-3'

    vm.nameShown = true
    vm.nameRequired = true

    vm.descriptionShown = true
    vm.descriptionRequired = false

    // FIXME: @record.snapshot_name_optional?
    if (['ovirt', 'redhat'].includes(vm.vm.vendor)) {
      vm.nameShown = false
      vm.descriptionRequired = true
    }
    if (vm.vm.vendor === 'openstack') {
      vm.nameShown = true
      vm.descriptionRequired = true
    }

    if (!vm.nameShown) {
      vm.nameRequired = false
    }
    if (!vm.descriptionShown) {
      vm.descriptionRequired = false
    }

    if (vm.nameRequired) {
      vm.nameLabel += ' *'
      vm.nameLabelClass += ' required'
    }
    if (vm.descriptionRequired) {
      vm.descriptionLabel += ' *'
      vm.descriptionLabelClass += ' required'
    }
  }

  function save () {
    VmsService.createSnapshots(vm.vm.id, vm.modalData).then(success, failure)
  }

  function success (response) {
    vm.close()
    $state.go($state.current, {}, {reload: true})
    EventNotifications.batch(response.results, __('Creating snapshot.'), __('Error creating snapshot.'))
  }

  function failure (response) {
    EventNotifications.error(__('There was an error creating the snapshot.') + response.message)
  }
}

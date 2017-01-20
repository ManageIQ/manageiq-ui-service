/* eslint camelcase: "off" */

export const OwnershipServiceModalComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&',
  },
  templateUrl: 'app/components/ownership-service-modal/ownership-service-modal.html',
};

/** @ngInject */
function ComponentController($state, lodash, CollectionsApi, EventNotifications) {
  var vm = this;

  angular.extend(vm, {
    modalData: {
      'owner': {
        'userid': '',
      },
      'group': {
        'description': '',
      },
    },
    isService: vm.resolve.services.length === 1,
    resetModal: false,
    services: vm.resolve.services,
    users: vm.resolve.users,
    groups: vm.resolve.groups,
    save: save,
    cancel: cancel,
    reset: reset,
  });
  activate();


  function cancel() {
    vm.dismiss({$value: 'cancel'});
  }

  function reset(event) {
    angular.copy(event.original, this.modalData); // eslint-disable-line angular/controller-as-vm
  }

  function save() {
    var data = {
      action: 'set_ownership',
      resources: null,
    };

    if (vm.isService) {
      data.resources = [vm.modalData];
    } else {
      var resources = [];
      angular.copy(vm.services, resources);
      lodash.forEach(resources, setOwnership);
      data.resources = resources;
    }

    CollectionsApi.post('services', '', {}, data).then(saveSuccess, saveFailure);

    function saveSuccess() {
      vm.close();
      EventNotifications.success(__("Ownership was saved."));
      $state.go($state.current, {}, {reload: true});
    }

    function saveFailure() {
      EventNotifications.error(__('There was an error saving ownership of this service.'));
    }

    function setOwnership(service) {
      service.owner = {userid: vm.modalData.owner.userid};
      service.group = {description: vm.modalData.group.description};
    }
  }

  // Private
  function activate() {
    if (vm.isService) {
      vm.resetModal = true;
      vm.modalData.id = vm.services[0].id;
      vm.modalData.owner.userid = vm.services[0].evm_owner && vm.services[0].evm_owner.userid || '';
      vm.modalData.group.description = vm.services[0].miq_group && vm.services[0].miq_group.description || '';
    }
  }
}

/* eslint camelcase: "off" */
import templateUrl from './ownership-service-modal.html';

export const OwnershipServiceModalComponent = {
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
function ComponentController($state, lodash, CollectionsApi, EventNotifications, ActionNotifications) {
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

    function saveSuccess(response) {
      vm.close();
      ActionNotifications.add(response, __('Setting ownership.'), __('Error setting ownership.'));
      $state.go($state.current, {}, {reload: true});
    }

    function saveFailure() {
      EventNotifications.error(__('There was an error saving ownership.'));
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

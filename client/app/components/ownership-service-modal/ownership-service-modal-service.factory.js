/* eslint camelcase: "off" */

(function() {
  'use strict';

  angular.module('app.components')
    .factory('OwnershipServiceModal', OwnershipServiceFactory);

  /** @ngInject */
  function OwnershipServiceFactory($modal) {
    var modalService = {
      showModal: showModal,
    };

    return modalService;

    function showModal(services) {
      var modalOptions = {
        templateUrl: 'app/components/ownership-service-modal/ownership-service-modal.html',
        controller: OwnershipServiceModalController,
        controllerAs: 'vm',
        size: 'lg',
        resolve: {
          services: resolveServiceDetails,
          users: resolveUsers,
          groups: resolveGroups,
        },
      };
      var modal = $modal.open(modalOptions);

      return modal.result;

      /** @ngInject */
      function resolveServiceDetails() {
        return services;
      }
    }
  }

  /** @ngInject */
  function resolveUsers(CollectionsApi) {
    var options = {expand: 'resources', attributes: ['userid', 'name'], sort_by: 'name', sort_options: 'ignore_case'};

    return CollectionsApi.query('users', options);
  }

  /** @ngInject */
  function resolveGroups(CollectionsApi) {
    var options = {expand: 'resources', attributes: ['description'], sort_by: 'description', sort_options: 'ignore_case'};

    return CollectionsApi.query('groups', options);
  }

  /** @ngInject */
  function OwnershipServiceModalController($state, $modalInstance, lodash, CollectionsApi, EventNotifications, users, groups, services) {
    var vm = this;
    var isService = services.length === 1;

    angular.extend(vm, {
      modalData: {
        'owner': {
          'userid': '',
        },
        'group': {
          'description': '',
        },
      },
      services: services,
      users: users,
      groups: groups,
      save: save,
      cancel: cancel,
      reset: reset,
    });
    activate();


    function cancel() {
      $modalInstance.dismiss();
    }

    function reset(event) {
      angular.copy(event.original, this.modalData); // eslint-disable-line angular/controller-as-vm
    }

    function save() {
      var data = {
        action: 'set_ownership',
        resources: null,
      };

      if (isService) {
        data.resources = [vm.modalData];
      } else {
        var resources = [];
        angular.copy(vm.services, resources);
        lodash.forEach(resources, setOwnership);
        data.resources = resources;
      }

      CollectionsApi.post('services', '', {}, data).then(saveSuccess, saveFailure);

      function saveSuccess() {
        $modalInstance.close();
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
      if (isService) {
        vm.modalData.id = vm.services[0].id;
        vm.modalData.owner.userid = vm.services[0].evm_owner && vm.services[0].evm_owner.userid || '';
        vm.modalData.group.description = vm.services[0].miq_group && vm.services[0].miq_group.description || '';
      }
    }
  }
})();

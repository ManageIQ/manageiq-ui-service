(function() {
  'use strict';

  angular.module('app.components')
    .factory('OwnershipServiceModal', OwnershipServiceFactory);

  /** @ngInject */
  function OwnershipServiceFactory($modal) {
    var modalService = {
      showModal: showModal
    };

    return modalService;

    function showModal(serviceDetails) {
      var modalOptions = {
        templateUrl: 'app/components/ownership-service-modal/ownership-service-modal.html',
        controller: OwnershipServiceModalController,
        controllerAs: 'vm',
        size: 'lg',
        resolve: {
          serviceDetails: resolveServiceDetails,
          users: resolveUsers,
          groups: resolveGroups
        }
      };
      var modal = $modal.open(modalOptions);

      return modal.result;

      /** @ngInject */
      function resolveServiceDetails(CollectionsApi) {
        var requestAttributes = [
          'evm_owner.userid',
          'miq_group.description'
        ];
        var options = {attributes: requestAttributes};

        return CollectionsApi.get('services', serviceDetails.id, options);
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
  function OwnershipServiceModalController(serviceDetails, $state, $modalInstance, CollectionsApi, Notifications, users, groups, sprintf) {
    var vm = this;

    vm.service = serviceDetails;
    vm.saveOwnership = saveOwnership;
    vm.users = users;
    vm.groups = groups;

    vm.modalData = {
      'action': 'set_ownership',
      'resource': {
        'owner': {
          'userid': vm.service.evm_owner && vm.service.evm_owner.userid || ''
        },
        'group': {
          'description': vm.service.miq_group && vm.service.miq_group.description || ''
        }
      }
    };
    activate();

    function activate() {
    }

    function saveOwnership() {
      CollectionsApi.post('services', vm.service.id, {}, vm.modalData).then(saveSuccess, saveFailure);

      function saveSuccess() {
        $modalInstance.close();
        Notifications.success(__(sprintf("%s ownership was saved.", vm.service.name)));
        $state.go($state.current, {}, {reload: true});
      }

      function saveFailure() {
        Notifications.error(__('There was an error saving ownership of this service.'));
      }
    }
  }
})();

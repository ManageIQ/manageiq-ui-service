(function() {
  'use strict';

  angular.module('app.components')
    .factory('RemoveServiceModal', Factory);

  /** @ngInject */
  function Factory($modal) {
    return {showModal: showModal};
    
    function showModal(services) {
      var modalOptions = {
        templateUrl: 'app/components/remove-service-modal/remove-service-modal.html',
        controller: ModalController,
        controllerAs: 'vm',
        size: 'md',
        resolve: {
          services: resolveServices,
        },
      };
      var modal = $modal.open(modalOptions);

      return modal.result;

      /** @ngInject */
      function resolveServices() {
        return services;
      }
    }
  }

  /** @ngInject */
  function ModalController($state, $modalInstance, lodash, CollectionsApi, EventNotifications, services) {
    var vm = this;

    angular.extend(vm, {
      services: services,
      confirm: confirm,
      cancel: cancel,
    });

    function cancel() {
      $modalInstance.dismiss();
    }

    function confirm() {
      var data = {
        action: 'delete',
        resources: vm.services,
      };
      CollectionsApi.post('services', '', {}, data).then(saveSuccess, saveFailure);

      function saveSuccess() {
        $modalInstance.close();
        EventNotifications.success(__("Services removed"));
        $state.go($state.current, {}, {reload: true});
      }

      function saveFailure() {
        EventNotifications.error(__('There was an error removing one or more services.'));
      }
    }
  }
})();

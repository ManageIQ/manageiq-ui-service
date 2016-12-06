(function() {
  'use strict';

  angular.module('app.components')
    .factory('RetireNowServiceModal', Factory);

  /** @ngInject */
  function Factory($modal) {
    return {showModal: showModal};

    function showModal(services) {
      var modalOptions = {
        templateUrl: 'app/components/retire-service-modal/immediate-retire-service-modal.html',
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
  function ModalController($state, $modalInstance, CollectionsApi, EventNotifications, services) {
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
        action: 'retire',
        resources: vm.services,
      };
      CollectionsApi.post('services', '', {}, data).then(saveSuccess, saveFailure);

      function saveSuccess() {
        $modalInstance.close();
        EventNotifications.success(__("Services retired"));
        $state.go($state.current, {}, {reload: true});
      }

      function saveFailure() {
        EventNotifications.error(__('There was an error retiring one or more services.'));
      }
    }
  }
})();

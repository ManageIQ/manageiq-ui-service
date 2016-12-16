(function() {
  'use strict';

  angular.module('app.components')
    .factory('ProcessRequestsModal', Factory);

  /** @ngInject */
  function Factory($uibModal) {
    return {showModal: showModal};

    function showModal(requests, modalType) {
      var modalOptions = {
        templateUrl: 'app/components/process-requests-modal/process-requests-modal.html',
        controller: ModalController,
        controllerAs: 'vm',
        size: 'md',
        resolve: {
          requests: resolveRequests,
          modalType: resolveModalType
        },
      };
      var modal = $uibModal.open(modalOptions);

      return modal.result;

      /** @ngInject */
      function resolveRequests() {
        return requests;
      }

      /** @ngInject */
      function resolveModalType() {
        return modalType;
      }
    }
  }

  /** @ngInject */
  function ModalController($state, $uibModalInstance, CollectionsApi, EventNotifications, requests, modalType) {
    var vm = this;

    angular.extend(vm, {
      requests: requests,
      modalType: modalType,
      save: save,
      cancel: cancel,
    });

    function cancel() {
      $uibModalInstance.dismiss();
    }

    function save() {
      var data = {
        action: vm.modalType === 'approve' ? 'approve' : 'deny',
        resources: vm.requests,
      };

      if (vm.modalType === 'deny') {

      }

      CollectionsApi.post('requests', '', {}, data).then(saveSuccess, saveFailure);

      function saveSuccess() {
        $uibModalInstance.close();
        switch (modalType) {
          case "approve":
            EventNotifications.success(__("Requests Approved"));
            break;
          case "deny":
            EventNotifications.success(__("Requests Denied"));
            break;
        }
        $state.go($state.current, {}, {reload: true});
      }

      function saveFailure() {
        EventNotifications.error(__('There was an error processing one or more requests.'));
      }
    }
  }
})();

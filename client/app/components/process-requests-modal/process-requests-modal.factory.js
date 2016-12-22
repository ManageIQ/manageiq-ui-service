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
          modalType: resolveModalType,
        },
      };
      var modal = $uibModal.open(modalOptions);

      return modal.result;

      /** @ngInject */
      function resolveRequests() {
        return requests;
      }

      /** @ngInject */
      function resolveModalType(lodash) {
        return lodash.find(requests, isPending) ? 'invalid' : modalType;

        function isPending(item) {
          return item.approval_state === 'approved' || item.approval_state === 'denied';
        }
      }
    }
  }

  /** @ngInject */
  function ModalController($state, $uibModalInstance, lodash, CollectionsApi, EventNotifications, requests, modalType) {
    var vm = this;

    angular.extend(vm, {
      modalData: {},
      requests: requests,
      modalType: modalType,
      submit: submit,
      cancel: cancel,
    });

    function cancel() {
      $uibModalInstance.dismiss();
    }

    function submit() {
      var data = {
        action: vm.modalType === 'approve' ? 'approve' : 'deny',
        resources: vm.requests,
      };

      lodash.forEach(data.resources, addReason);
      CollectionsApi.post('requests', '', {}, data).then(saveSuccess, saveFailure);

      function addReason(item) {
        item.reason = vm.modalData.reason;
      }

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

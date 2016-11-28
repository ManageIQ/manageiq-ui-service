(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'requests.requests.details': {
        url: '/:requestId',
        templateUrl: 'app/states/requests/requests/details/details.html',
        controller: RequestDetailsController,
        controllerAs: 'vm',
        title: N_('Request Details'),
        resolve: {
          request: resolveRequest,
        },
      },
    };
  }

  /** @ngInject */
  function resolveRequest($stateParams, CollectionsApi) {
    var options = {attributes: ['provision_dialog', 'picture', 'picture.image_href']};

    return CollectionsApi.get('requests', $stateParams.requestId, options);
  }

  /** @ngInject */
  function RequestDetailsController(request, $state, $stateParams, CollectionsApi, EventNotifications, RBAC) {
    var vm = this;

    vm.request = request;
    vm.title = request.description;

    vm.updateApprovalState = updateApprovalState;
    vm.pendingApproval = pendingApproval;

    function updateApprovalState(action) {
      var data = {
        "action": action,
        "resource": {
          "reason": vm.approvalReason,
        },
      };

      CollectionsApi.post('service_requests', $stateParams.requestId, {}, data).then(success, failure);

      function success() {
        EventNotifications.success(__('Request approval state updated.'));
        $state.go($state.current, {}, {reload: true});
      }

      function failure() {
        EventNotifications.error(__('There was an error updating the request approval state.'));
      }
    }

    function pendingApproval() {
      return vm.request.approval_state === 'pending_approval' && RBAC.has('miq_request_approval');
    }
  }
})();

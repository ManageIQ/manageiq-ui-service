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
      'requests.order_details': {
        url: '/order/:serviceOrderId',
        templateUrl: 'app/states/requests/order_details/order_details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('Order Details'),
        resolve: {
          order: resolveOrder,
        },
      },
    };
  }

  /** @ngInject */
  function resolveOrder($stateParams, CollectionsApi) {
    return CollectionsApi.get('service_orders', $stateParams.serviceOrderId, {
      expand: ['resources', 'service_requests'],
    });
  }

  /** @ngInject */
  function StateController(order, $state) {
    var vm = this;

    vm.order = order;

    vm.requestListConfig = {
      showSelectBox: false,
      selectionMatchProp: 'id',
      onClick: handleRequestClick,
    };

    function handleRequestClick(item, _e) {
      $state.go('requests.details', { requestId: item.id });
    }
  }
})();

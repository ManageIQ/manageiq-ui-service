/** @ngInject */
export function OrdersDetailsState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'orders.details': {
      url: '/:serviceOrderId',
      templateUrl: 'app/states/orders/details/details.html',
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

  vm.title = order.name;
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

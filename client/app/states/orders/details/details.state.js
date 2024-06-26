import template from './details.html';

/** @ngInject */
export function OrdersDetailsState (routerHelper, RBAC) {
  routerHelper.configureStates(getStates(RBAC))
}

function getStates (RBAC) {
  return {
    'orders.details': {
      url: '/:serviceOrderId',
      template,
      controller: StateController,
      controllerAs: 'vm',
      title: __('Order Details'),
      resolve: {
        order: resolveOrder,
        serviceTemplate: resolveServiceTemplate
      },
      data: {
        authorization: RBAC.has('miq_request_show')
      }
    }
  }
}

/** @ngInject */
function resolveOrder ($stateParams, CollectionsApi) {
  return CollectionsApi.get('service_orders', $stateParams.serviceOrderId, {
    expand: ['resources', 'service_requests']
  })
}

/** @ngInject */
function resolveServiceTemplate ($stateParams, CollectionsApi) {
  return CollectionsApi.get('service_orders', $stateParams.serviceOrderId, {
    expand: ['resources', 'service_requests']
  }).then((ServiceOrder) => {
    const serviceTemplateId = ServiceOrder.service_requests[0].source_id;
    return CollectionsApi.get('service_templates', serviceTemplateId, {
      expand: ['resources'],
      attributes: ['picture', 'resource_actions', 'picture.image_href'],
    })
  })
}

/** @ngInject */
function StateController (order, serviceTemplate, $state) {
  const vm = this
  vm.order = order
  vm.serviceTemplate = serviceTemplate

  vm.requestListConfig = {
    showSelectBox: false,
    selectionMatchProp: 'id'
  }
}

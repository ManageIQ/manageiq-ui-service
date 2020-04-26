/* eslint camelcase: "off" */

/** @ngInject */
export function OrdersStateFactory (ListConfiguration, CollectionsApi, RBAC) {
  const collection = 'service_orders'
  const service = {
    getMinimal: getMinimal,
    getOrders: getOrders,
    getPermissions: getPermissions
  }

  ListConfiguration.setupListFunctions(service, {id: 'placed_at', title: __('Order Date'), sortType: 'numeric'})

  return service

  function getMinimal (filters) {
    const options = {
      filter: getQueryFilters(filters),
      hide: 'resources',
      auto_refresh: true
    }

    return CollectionsApi.query(collection, options)
  }

  function getOrders (limit, offset, filters, sortField, sortAscending, refresh) {
    const options = {
      expand: ['resources', 'service_requests'],
      limit: limit,
      offset: String(offset),
      attributes: [],
      filter: getQueryFilters(filters),
      auto_refresh: refresh
    }

    if (angular.isDefined(sortField)) {
      options.sort_by = service.getSort().currentField.id
      options.sort_options = service.getSort().currentField.sortType === 'alpha' ? 'ignore_case' : ''
      options.sort_order = sortAscending ? 'asc' : 'desc'
    }

    return CollectionsApi.query(collection, options)
  }

  // Private

  function getQueryFilters (filters) {
    const queryFilters = ['state=ordered', 'type=ServiceOrderCart'];

    angular.forEach(filters, function (nextFilter) {
      if (nextFilter.id === 'name') {
        queryFilters.push("name='%" + nextFilter.value + "%'")
      } else {
        queryFilters.push(nextFilter.id + '=' + nextFilter.value)
      }
    })

    return queryFilters
  }
  function getPermissions () {
    const permissions = {
      approve: RBAC.has('miq_request_approval'),
      delete: RBAC.has(RBAC.FEATURES.ORDERS.DELETE),
      copy: RBAC.has(RBAC.FEATURES.ORDERS.DUPLICATE)
    }

    return permissions
  }
}

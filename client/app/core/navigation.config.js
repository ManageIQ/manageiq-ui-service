/* eslint camelcase: "off" */

/** @ngInject */
export function navConfig (NavigationProvider) {
  const dashboard = createItem({
    title: N_('Dashboard'),
    originalTitle: 'Dashboard',
    state: 'dashboard',
    iconClass: 'fa fa-dashboard'
  })

  const services = createItem({
    title: N_('My Services'),
    originalTitle: 'My Services',
    state: 'services',
    iconClass: 'pficon pficon-service',
    badgeTooltip: N_('Total services ordered, both active and retired'),
    originalTooltip: 'Total services ordered, both active and retired'
  })

  const orders = createItem({
    title: N_('My Orders'),
    originalTitle: 'My Orders',
    state: 'orders',
    iconClass: 'fa fa-file-o',
    badgeTooltip: N_('Total orders submitted'),
    originalTooltip: 'Total orders submitted'
  })

  const catalogs = createItem({
    title: N_('Service Catalog'),
    originalTitle: 'Service Catalog',
    state: 'catalogs',
    iconClass: 'fa fa-folder-open-o',
    badgeTooltip: N_('The total number of available catalogs'),
    originalTooltip: 'The total number of available catalogs'
  })

  NavigationProvider.configure({
    items: {
      dashboard: dashboard,
      services: services,
      orders: orders,
      catalogs: catalogs
    }
  })

  function createItem (item) {
    if (angular.isDefined(item.badgeTooltip)) {
      item.badges = [
        {
          count: 0,
          tooltip: item.badgeTooltip,
          originalTooltip: item.originalTooltip
        }
      ]
    }

    return item
  }
}

/** @ngInject */
export function navInit (lodash, CollectionsApi, Navigation, NavCounts, POLLING_INTERVAL) {
  const refreshTimeMs = POLLING_INTERVAL
  const options = {
    hide: 'resources',
    auto_refresh: true
  }

  NavCounts.add('services', fetchServices, refreshTimeMs)
  NavCounts.add('orders', fetchOrders, refreshTimeMs)
  NavCounts.add('catalogs', fetchServiceCatalogs, refreshTimeMs)

  function fetchOrders () {
    angular.extend(options, {
      filter: ['state=ordered']
    })

    CollectionsApi.query('service_orders', options)
      .then(lodash.partial(updateCount, 'orders'))
  }

  function fetchServices () {
    angular.extend(options, {
      filter: ['ancestry=null']
    })

    CollectionsApi.query('services', options)
      .then(lodash.partial(updateCount, 'services'))
  }

  function fetchServiceCatalogs () {
    angular.extend(options, {
      filter: ['display=true']
    })

    CollectionsApi.query('service_templates', options)
      .then(lodash.partial(updateCount, 'catalogs'))
  }

  function updateCount (item, data) {
    Navigation.items[item].badges[0].count = data.subcount
  }
}

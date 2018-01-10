import NavActions from '../actions/nav'

/** @ngInject */
export function NavigationFactory (RBAC, Polling, POLLING_INTERVAL, $ngRedux, CollectionsApi) {
  let menuItems = []
  var service = {
    get: getNavigation,
    menuItems: menuItems,
    init: initNavigation,
    updateBadgeCounts: updateBadgeCounts
  }
  const actions = NavActions
  const mapStateToThis = (state) => ({
    navCount: state.nav
  })

  $ngRedux.connect(mapStateToThis, actions)(service)

  return service
  function getNavigation () {
    return menuItems
  }
  function initNavigation () {
    const allMenuItems = [
      {
        title: __('Dashboard'),
        state: 'dashboard',
        iconClass: 'fa fa-dashboard',
        permissions: true
      },
      {
        title: __('My Services'),
        state: 'services',
        iconClass: 'pficon pficon-service',
        badgeQuery: {
          'field': 'services',
          'filter': 'ancestry=null'
        },
        badges: [
          {
            count: service.navCount['services'],
            tooltip: __('Total services ordered, both active and retired')
          }
        ],
        permissions: RBAC.has(RBAC.FEATURES.SERVICES.VIEW)
      },
      {
        title: __('My Orders'),
        originalTitle: 'My Orders',
        state: 'orders',
        iconClass: 'fa fa-file-o',
        badgeQuery: {
          'field': 'service_orders',
          'filter': 'state=ordered'
        },
        badges: [
          {
            count: service.navCount['orders'],
            tooltip: __('Total orders submitted')
          }
        ],
        permissions: RBAC.has(RBAC.FEATURES.ORDERS.VIEW)
      },
      {
        title: __('Service Catalog'),
        originalTitle: 'Service Catalog',
        state: 'catalogs',
        iconClass: 'fa fa-folder-open-o',
        badgeQuery: {
          'field': 'service_templates',
          'filter': 'display=true'
        },
        badges: [
          {
            count: service.navCount['catalogs'],
            tooltip: __('The total number of available catalogs')
          }
        ],
        permissions: RBAC.has(RBAC.FEATURES.SERVICE_CATALOG.VIEW)
      }
    ]

    menuItems = allMenuItems.filter((item) => item.permissions)
    updateBadgeCounts()
    Polling.start('badgeCounts', updateBadgeCounts, POLLING_INTERVAL)

    return menuItems
  }
  function updateBadgeCounts () {
    menuItems.forEach((item) => {
      if (angular.isDefined(item.badges)) {
        getBadgeCount(item.badgeQuery.field, item.badgeQuery.filter).then((count) => {
          service.addCount(item.state, count)
          item.badges[0].count = service.navCount[item.state]
        })
      }
    })
  }
  function getBadgeCount (field, filter) {
    const options = {
      hide: 'resources',
      auto_refresh: true,
      filter: [filter]
    }
    return new Promise((resolve, reject) => {
      CollectionsApi.query(field, options)
      .then((data) => {
        resolve(data.subquery_count)
      })
    })
  }
}

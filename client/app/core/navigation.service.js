/** @ngInject */
export function NavigationFactory (RBAC, Polling, POLLING_INTERVAL, CollectionsApi) {
  let menuItems = []
  const service = {
    get: getNavigation,
    menuItems: menuItems,
    init: initNavigation,
    updateBadgeCounts: updateBadgeCounts,
    navCount: {
      services: 0,
      orders: 0,
      catalogs: 0,
    },
  };

  Polling.start('badgeCounts', updateBadgeCounts, POLLING_INTERVAL)

  return service

  function getNavigation () {
    setPermissions()

    return menuItems.filter((item) => item.permissions)
  }

  function initNavigation () {
    menuItems = [
      {
        title: __('Dashboard'),
        state: 'dashboard',
        iconClass: 'fa fa-dashboard',
        permissions: true
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
            count: service.navCount.catalogs,
            tooltip: __('The total number of available catalogs')
          }
        ],
        permissions: false
      },
      {
        title: __('My Services'),
        state: 'services',
        iconClass: 'pficon pficon-service',
        badgeQuery: {
          'field': 'services',
          'filter': ['ancestry=null', 'visible=true']
        },
        badges: [
          {
            count: service.navCount.services,
            tooltip: __('Total services ordered, both active and retired')
          }
        ],
        permissions: false
      },
      {
        title: __('My Orders'),
        originalTitle: 'My Orders',
        state: 'orders',
        iconClass: 'fa fa-file-o',
        badgeQuery: {
          'field': 'service_orders',
          'filter': ['state=ordered', 'type=ServiceOrderCart'],
        },
        badges: [
          {
            count: service.navCount.orders,
            tooltip: __('Total orders submitted')
          }
        ],
        permissions: false
      }
    ]
    setPermissions()
    updateBadgeCounts()

    return menuItems.filter((item) => item.permissions)
  }

  function updateBadgeCounts () {
    menuItems.forEach((item) => {
      if (angular.isDefined(item.badges)) {
        getBadgeCount(item.badgeQuery.field, item.badgeQuery.filter).then((count) => {
          item.badges[0].count = count;
          service.navCount[item.state] = count;
        });
      }
    });
  }

  function getBadgeCount (field, filter) {
    const options = {
      hide: 'resources',
      auto_refresh: true,
      filter: Array.isArray(filter) ? filter : [filter],
    };

    return CollectionsApi.query(field, options).then((data) => data.subquery_count);
  }

  function setPermissions () {
    menuItems[0].permissions = RBAC.has(RBAC.FEATURES.DASHBOARD.VIEW)
    menuItems[1].permissions = RBAC.has(RBAC.FEATURES.SERVICES.VIEW)
    menuItems[2].permissions = RBAC.has(RBAC.FEATURES.ORDERS.VIEW)
    menuItems[3].permissions = RBAC.has(RBAC.FEATURES.SERVICE_CATALOG.VIEW)
  }
}

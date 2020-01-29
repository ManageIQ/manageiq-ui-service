import appCounterActions from '../actions/appCounters'
import { APPCOUNTERS } from '../constants/appCounters'

/** @ngInject */
export function NavigationFactory (RBAC, Polling, POLLING_INTERVAL, $ngRedux, CollectionsApi) {
  let menuItems = []
  const service = {
    get: getNavigation,
    menuItems: menuItems,
    init: initNavigation,
    updateBadgeCounts: updateBadgeCounts
  }
  const actions = appCounterActions
  const mapStateToThis = (state) => ({
    navCount: state.appCounters
  })

  $ngRedux.connect(mapStateToThis, actions)(service)

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
        title: __('My Services'),
        state: 'services',
        iconClass: 'pficon pficon-service',
        badgeQuery: {
          'field': 'services',
          'filter': 'ancestry=null'
        },
        badges: [
          {
            count: service.navCount[APPCOUNTERS.SERVICES_COUNT],
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
          'filter': 'state=ordered'
        },
        badges: [
          {
            count: service.navCount[APPCOUNTERS.ORDERS_COUNT],
            tooltip: __('Total orders submitted')
          }
        ],
        permissions: false
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
            count: service.navCount[APPCOUNTERS.CATALOGS_COUNT],
            tooltip: __('The total number of available catalogs')
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
          let counterField = ''
          switch (item.state) {
            case 'services':
              service.addServicesCount(count)
              counterField = APPCOUNTERS.SERVICES_COUNT
              break
            case 'catalogs':
              service.addCatalogsCount(count)
              counterField = APPCOUNTERS.CATALOGS_COUNT
              break
            case 'orders':
              service.addOrdersCount(count)
              counterField = APPCOUNTERS.ORDERS_COUNT
              break
          }
          item.badges[0].count = service.navCount[counterField]
        })
      }
    })
  }

  function getBadgeCount (field, filter) {
    const options = {
      hide: 'resources',
      auto_refresh: true,
      filter: [filter],
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

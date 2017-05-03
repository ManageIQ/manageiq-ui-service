/* eslint camelcase: "off" */

/** @ngInject */
export function navConfig(NavigationProvider) {
  const dashboard = createItem({
    title: N_('Dashboard'),
    originalTitle: 'Dashboard',
    state: 'dashboard',
    iconClass: 'fa fa-dashboard',
  });

  const services = createItem({
    title: N_('My Services'),
    originalTitle: 'My Services',
    state: 'services',
    iconClass: 'pficon pficon-service',
    badgeTooltip: N_('Total services ordered, both active and retired'),
    originalTooltip: 'Total services ordered, both active and retired',
  });

  const orders = createItem({
    title: N_('My Orders'),
    originalTitle: 'My Orders',
    state: 'orders',
    iconClass: 'fa fa-file-o',
    badgeTooltip: N_('Total orders submitted'),
    originalTooltip: 'Total orders submitted',
  });

  const catalogs = createItem({
    title: N_('Service Catalog'),
    originalTitle: 'Service Catalog',
    state: 'catalogs',
    iconClass: 'fa fa-folder-open-o',
    badgeTooltip: N_('The total number of available catalogs'),
    originalTooltip: 'The total number of available catalogs',
  });
  /*
   const dialogs = createItem({
   title: N_('Dialogs'),
   originalTitle: 'Dialogs',
   state: 'dialogs',
   iconClass: 'pficon pficon-build',
   badgeTooltip: N_('Total available dialogs'),
   originalTooltip: 'Total available dialogs',
   });

   const reports = createItem({
   title: N_('Reports'),
   originalTitle: 'Reports',
   state: 'reports',
   iconClass: 'fa fa-area-chart',
   badgeTooltip: N_('Reports'),
   originalTooltip: 'Reports',
   });

   const templates = createItem({
   title: N_('Templates'),
   originalTitle: 'Templates',
   state: 'templates',
   iconClass: 'pficon pficon-builder-image',
   badgeTooltip: N_('Total available Templates'),
   originalTooltip: 'Total available Templates',
   }); */

  NavigationProvider.configure({
    items: {
      dashboard: dashboard,
      services: services,
      orders: orders,
      catalogs: catalogs,
      //   dialogs: dialogs,
      //    reports: reports,
      //   templates: templates,
    },
  });

  function createItem(item) {
    if (angular.isDefined(item.badgeTooltip)) {
      item.badges = [
        {
          count: 0,
          tooltip: item.badgeTooltip,
          originalTooltip: item.originalTooltip,
        },
      ];
    }

    return item;
  }
}

/** @ngInject */
export function navInit(lodash, CollectionsApi, Navigation, NavCounts, POLLING_INTERVAL) {
  const refreshTimeMs = POLLING_INTERVAL;
  const options = {
    hide: 'resources',
    auto_refresh: true,
  };

  NavCounts.add('services', fetchServices, refreshTimeMs);
  NavCounts.add('orders', fetchOrders, refreshTimeMs);
  NavCounts.add('catalogs', fetchServiceCatalogs, refreshTimeMs);
  // NavCounts.add('dialogs', fetchDialogs, refreshTimeMs);
  // NavCounts.add('templates', fetchTemplates, refreshTimeMs);

  function fetchOrders() {
    angular.extend(options, {
      filter: ['state=ordered'],
    });

    CollectionsApi.query('service_orders', options)
      .then(lodash.partial(updateCount, 'orders'));
  }

  function fetchServices() {
    angular.extend(options, {
      filter: ['ancestry=null'],
    });

    CollectionsApi.query('services', options)
      .then(lodash.partial(updateCount, 'services'));
  }

  function fetchServiceCatalogs() {
    angular.extend(options, {
      filter: ['id>0'],
    });

    CollectionsApi.query('service_catalogs', options)
      .then(lodash.partial(updateCount, 'catalogs'));
  }

  /*
   function fetchDialogs() {
   angular.extend(options, {
   filter: ['id>0'],
   });
   CollectionsApi.query('service_dialogs', options)
   .then(lodash.partial(updateCount, 'dialogs'));
   }

   function fetchTemplates() {
   CollectionsApi.query('orchestration_templates', options)
   .then(lodash.partial(updateCount, 'templates'));
   }
   */
  function updateCount(item, data) {
    Navigation.items[item].badges[0].count = data.subcount;
  }
}

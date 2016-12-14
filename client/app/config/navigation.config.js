/* eslint camelcase: "off" */
(function() {
  'use strict';

  angular.module('app.config')
    .config(navigation)
    .run(init);

  /** @ngInject */
  function navigation(NavigationProvider) {
    var dashboard = createItem(
      N_('Dashboard'),
      'dashboard',
      'fa fa-dashboard'
    );
    var services = createItem(
      N_('Services'),
      'services',
      'fa fa-file-o'
    );
    var marketplace = createItem(
      N_('Service Catalog'),
      'marketplace',
      'fa fa-copy',
      N_('Total available catalog items')
    );
    var designer = createItem(
      N_('Designer'),
      'designer',
      'pficon pficon-blueprint'
    );
    var administration = createItem(
      N_('Administration'),
      'administration',
      'fa fa-cog'
    );

    services.secondary = {
      'service-explorer': createItem(
        N_('Service Explorer'),
        'services',
        undefined,
        N_('Total services ordered, both active and retired')
      ),
      'request-explorer': createItem(
        N_('Request Explorer'),
        'requests',
        undefined,
        N_('Total pending requests')
      ),
      orders: createItem(
        N_('Order History'),
        'orders',
        undefined,
        N_('Total orders submitted')
      ),
    };

    designer.secondary = {
      catalogs: createItem(
        N_('Catalogs'),
        'designer.catalogs',
        undefined,
        N_('The total number of available catalogs')
      ),
      blueprints: createItem(
        N_('Blueprints'),
        'designer.blueprints',
        undefined,
        N_('Total available blueprints')
      ),
      dialogs: createItem(
        N_('Dialogs'),
        'designer.dialogs',
        undefined,
        N_('Total available dialogs')
      ),
    };

    administration.secondary = {
      profiles: createItem(
        N_('Profiles'),
        'administration.profiles',
        undefined,
        N_('Total available arbitration profiles')
      ),
      rules: createItem(
        N_('Rules'),
        'administration.rules',
        undefined,
        N_('Total available arbitration rules')
      ),
    };

    NavigationProvider.configure({
      items: {
        dashboard: dashboard,
        services: services,
        marketplace: marketplace,
        designer: designer,
        administration: administration,
      },
    });

    function createItem(title, state, iconClass, badgeTooltip) {
      var item = {
        title: title,
        state: state,
        iconClass: iconClass,
      };

      if (angular.isString(badgeTooltip)) {
        item.badges = [
          {
            count: 0,
            tooltip: badgeTooltip,
          },
        ];
      }

      return item;
    }
  }

  /** @ngInject */
  function init(lodash, CollectionsApi, Navigation, NavCounts) {
    var refreshTimeMs = 60 * 1000;
    var options = {
      hide: 'resources',
      auto_refresh: true,
    };

    NavCounts.add('services', fetchServices, refreshTimeMs);
    NavCounts.add('requests', fetchRequests, refreshTimeMs);
    NavCounts.add('orders', fetchOrders, refreshTimeMs);
    NavCounts.add('marketplace', fetchServiceTemplates, refreshTimeMs);
    NavCounts.add('catalogs', fetchServiceCatalogs, refreshTimeMs);
    NavCounts.add('blueprints', fetchBlueprints, refreshTimeMs);
    NavCounts.add('dialogs', fetchDialogs, refreshTimeMs);
    NavCounts.add('profiles', fetchProfiles, refreshTimeMs);
    NavCounts.add('rules', fetchRules, refreshTimeMs);

    function fetchRequests() {
      angular.extend(options, {
        filter: ["approval_state=pending_approval"],
      });

      CollectionsApi.query('requests', options)
        .then(lodash.partial(updateSecondaryCount, 'services', 'request-explorer'));
    }

    function fetchOrders() {
      angular.extend(options, {
        filter: ['state=ordered'],
      });

      CollectionsApi.query('service_orders', options)
        .then(lodash.partial(updateSecondaryCount, 'services', 'orders'));
    }

    function fetchServices() {
      angular.extend(options, {
        filter: ['ancestry=null'],
      });

      CollectionsApi.query('services', options)
        .then(lodash.partial(updateSecondaryCount, 'services', 'service-explorer'));
    }

    function fetchServiceTemplates() {
      angular.extend(options, {
        filter: ['service_template_catalog_id>0', 'display=true'],
      });

      CollectionsApi.query('service_templates', options)
        .then(lodash.partial(updateCount, 'marketplace'));
    }

    function fetchServiceCatalogs() {
      angular.extend(options, {
        filter: ['id>0'],
      });

      CollectionsApi.query('service_catalogs', options)
        .then(lodash.partial(updateSecondaryCount, 'designer', 'catalogs'));
    }

    function fetchBlueprints() {
      angular.extend(options, {
        filter: ['id>0'],
      });

      CollectionsApi.query('blueprints', options)
        .then(lodash.partial(updateSecondaryCount, 'designer', 'blueprints'));
    }

    function fetchDialogs() {
      angular.extend(options, {
        filter: ['id>0'],
      });
      CollectionsApi.query('service_dialogs', options)
        .then(lodash.partial(updateSecondaryCount, 'designer', 'dialogs'));
    }

    function fetchProfiles() {
      angular.extend(options, {
        filter: ['id>0'],
      });

      CollectionsApi.query('arbitration_profiles', options)
        .then(lodash.partial(updateSecondaryCount, 'administration', 'profiles'));
    }

    function fetchRules() {
      angular.extend(options, {
        filter: ['id>0'],
      });

      CollectionsApi.query('arbitration_rules', options)
        .then(lodash.partial(updateSecondaryCount, 'administration', 'rules'));
    }

    function updateCount(item, data) {
      Navigation.items[item].badges[0].count = data.subcount;
    }

    function updateSecondaryCount(primary, secondary, data) {
      Navigation.items[primary].secondary[secondary].badges[0].count = data.subcount;
    }
  }
})();

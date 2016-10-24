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
      N_('My Services'),
      'services',
      'fa fa-file-o',
      N_('The total number of services that you have ordered, both active and retired')
    );
    var requests = createItem(
      N_('My Requests'),
      'requests',
      'fa fa-file-text-o'
    );
    var marketplace = createItem(
      N_('Service Catalog'),
      'marketplace',
      'fa fa-copy',
      N_('The total number of available catalog items')
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

    requests.secondary = {
      requests: createItem(
        N_('Requests'),
        'requests.requests',
        undefined,
        N_('The total number of requests that you have submitted')
      ),
      orders: createItem(
        N_('Order History'),
        'requests.orders',
        undefined,
        N_('The total number of orders that you have submitted')
      ),
    };

    designer.secondary = {
      blueprints: createItem(
        N_('Blueprints'),
        'designer.blueprints',
        undefined,
        N_('The total number of available blueprints')
      ),
      dialogs: createItem(
        N_('Dialogs'),
        'designer.dialogs',
        undefined,
        N_('The total number of available dialogs')
      ),
    };

    administration.secondary = {
      profiles: createItem(
        N_('Profiles'),
        'administration.profiles',
        undefined,
        N_('The total number of available arbitration profiles')
      ),
      rules: createItem(
        N_('Rules'),
        'administration.rules',
        undefined,
        N_('The total number of available arbitration rules')
      ),
    };

    NavigationProvider.configure({
      items: {
        dashboard: dashboard,
        services: services,
        requests: requests,
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
        item.badges =  [
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

    NavCounts.add('services', fetchServices, refreshTimeMs);
    NavCounts.add('requests', fetchRequests, refreshTimeMs);
    NavCounts.add('orders', fetchOrders, refreshTimeMs);
    NavCounts.add('marketplace', fetchServiceTemplates, refreshTimeMs);
    NavCounts.add('blueprints', fetchBlueprints, refreshTimeMs);
    NavCounts.add('dialogs', fetchDialogs, refreshTimeMs);
    NavCounts.add('profiles', fetchProfiles, refreshTimeMs);
    NavCounts.add('rules', fetchRules, refreshTimeMs);

    function fetchRequests() {
      var filterValues = ['type=ServiceReconfigureRequest', 'or type=ServiceTemplateProvisionRequest'];
      var options = {
        auto_refresh: true,
        filter: filterValues,
      };

      CollectionsApi.query('requests', options)
        .then(lodash.partial(updateSecondaryCount, 'requests', 'requests'));
    }

    function fetchOrders() {
      var filterValues = ['state=ordered'];
      var options = {
        auto_refresh: true,
        filter: filterValues,
      };

      CollectionsApi.query('service_orders', options)
        .then(lodash.partial(updateSecondaryCount, 'requests', 'orders'));
    }

    function fetchServices() {
      var options = {
        expand: false,
        filter: ['service_id=nil'],
        auto_refresh: true,
      };

      CollectionsApi.query('services', options)
        .then(lodash.partial(updateCount, 'services'));
    }

    function fetchServiceTemplates() {
      var options = {
        expand: false,
        filter: ['service_template_catalog_id>0', 'display=true'],
        auto_refresh: true,
      };

      CollectionsApi.query('service_templates', options)
        .then(lodash.partial(updateCount, 'marketplace'));
    }

    function fetchBlueprints() {
      var options = {
        expand: false,
        filter: ['id>0'],
        auto_refresh: true,
      };

      CollectionsApi.query('blueprints', options)
        .then(lodash.partial(updateSecondaryCount, 'designer', 'blueprints'));
    }

    function fetchDialogs() {
      var options = {
        expand: false,
        filter: ['id>0'],
        auto_refresh: true,
      };

      CollectionsApi.query('service_dialogs', options)
        .then(lodash.partial(updateSecondaryCount, 'designer', 'dialogs'));
    }

    function fetchProfiles() {
      var options = {
        expand: false,
        filter: ['id>0'],
        auto_refresh: true,
      };

      CollectionsApi.query('arbitration_profiles', options)
        .then(lodash.partial(updateSecondaryCount, 'administration', 'profiles'));
    }

    function fetchRules() {
      var options = {
        expand: false,
        filter: ['id>0'],
        auto_refresh: true,
      };

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

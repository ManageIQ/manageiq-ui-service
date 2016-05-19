(function() {
  'use strict';

  angular.module('app.config')
    .config(navigation)
    .run(init);

  /** @ngInject */
  function navigation(NavigationProvider) {
    NavigationProvider.configure({
      items: {
        primary: {
          dashboard: {
            title: N_('Dashboard'),
            state: 'dashboard',
            icon: 'fa fa-dashboard',
          },
          services: {
            title: N_('My Services'),
            state: 'services',
            icon: 'fa fa-file-o',
            tooltip: N_('The total number of services that you have ordered, both active and retired'),
          },
          requests: {
            title: N_('My Requests'),
            state: 'requests',
            icon: 'fa fa-file-text-o',
            tooltip: N_('The total number of requests that you have submitted'),
          },
          dialogs: {
            title: N_('My Dialogs'),
            state: 'dialogs',
            icon: 'fa fa-list-alt',
            tooltip: N_('List of available Service dialogs'),
          },
          marketplace: {
            title: N_('Service Catalog'),
            state: 'marketplace',
            icon: 'fa fa-copy',
            tooltip: N_('The total number of available catalog items'),
          },
          blueprints: {
            title: N_('Blueprints'),
            state: 'blueprints',
            icon: 'fa fa-sitemap',
            tooltip: N_('The total number of available blueprints'),
          }
        },
        secondary: {
        }
      }
    });
  }

  /** @ngInject */
  function init(lodash, CollectionsApi, Navigation, NavCounts) {
    NavCounts.add('services', fetchServices, 60 * 1000);
    NavCounts.add('requests', fetchRequests, 60 * 1000);
    NavCounts.add('dialogs', fetchDialogs, 60 * 1000);
    NavCounts.add('marketplace', fetchServiceTemplates, 60 * 1000);
    NavCounts.add('blueprints', fetchBlueprints, 60 * 1000);

    function fetchDialogs() {
      var options = {
        auto_refresh: true,
      };

      CollectionsApi.query('service_dialogs', options)
        .then(lodash.partial(updateDialogsCount, 'dialogs'));
    }

    function fetchRequests() {
      var filterValues = ['type=ServiceReconfigureRequest', 'or type=ServiceTemplateProvisionRequest'];
      var options = {
        auto_refresh: true,
        filter: filterValues
      };

      CollectionsApi.query('requests', options)
        .then(lodash.partial(updateCount, 'requests'));
    }

    function fetchServices() {
      var options = {
        expand: false,
        filter: ['service_id=nil'],
        auto_refresh: true,
      };

      CollectionsApi.query('services', options)
        .then(lodash.partial(updateServicesCount, 'services'));
    }

    function fetchServiceTemplates() {
      var options = {
        expand: false,
        filter: ['service_template_catalog_id>0', 'display=true'],
        auto_refresh: true,
      };

      CollectionsApi.query('service_templates', options)
        .then(lodash.partial(updateServiceTemplatesCount, 'marketplace'));
    }

    function fetchBlueprints() {
      updateBlueprintsCount('blueprints', null);
    }

    function updateDialogsCount(item, data) {
      Navigation.items.primary[item].count = data.count;
    }

    function updateCount(item, data) {
      Navigation.items.primary[item].count = data.subcount;
    }

    function updateServicesCount(item, data) {
      Navigation.items.primary[item].count = data.subcount;
    }

    function updateServiceTemplatesCount(item, data) {
      Navigation.items.primary[item].count = data.subcount;
    }

    function updateBlueprintsCount(item, data) {
      Navigation.items.primary[item].count = -1;
    }
  }
})();

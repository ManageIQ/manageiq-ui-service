(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'designer.blueprints.editor': {
        url: '/:blueprintId',
        templateUrl: 'app/states/designer/blueprints/editor/editor.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Blueprint Designer',
        resolve: {
          blueprint: resolveBlueprint,
          blueprintTags: resolveBlueprintTags,
          serviceTemplates: resolveServiceTemplates,
        },
      },
    };
  }

  /** @ngInject */
  function resolveBlueprint($stateParams, CollectionsApi) {
    if ($stateParams.blueprintId) {
      return CollectionsApi.get('blueprints', $stateParams.blueprintId, {});
    } else {
      return null;
    }
  }

  function resolveBlueprintTags($stateParams, CollectionsApi) {
    if ($stateParams.blueprintId) {
      var attributes = ['categorization', 'category.id', 'category.single_value'];
      var options = {
        expand: 'resources',
        attributes: attributes,
      };
      var collection = 'blueprints/' + $stateParams.blueprintId + '/tags';

      return CollectionsApi.query(collection, options);
    } else {
      return null;
    }
  }

  function resolveServiceTemplates($stateParams, CollectionsApi) {
    var attributes = ['name', 'picture', 'picture.image_href', 'service_type', 'prov_type', 'service_template_catalog.name',
      'generic_subtype'];
    var options = {
      expand: 'resources',
      filter: ['service_template_catalog_id>0', 'display=true'],
      attributes: attributes,
    };

    return CollectionsApi.query('service_templates', options);
  }

  /** @ngInject */
  function StateController($log, blueprint, blueprintTags, serviceTemplates) {
    var vm = this;
    vm.title = 'Blueprint Designer';
    if (blueprint) {
      if (blueprintTags && blueprintTags.resources) {
        blueprint.tags = blueprintTags.resources;
        angular.forEach(blueprint.tags, processTag);   // <--- Add this line
      }
      vm.blueprint = blueprint;
    }

    function processTag(tag) {
      if (tag.categorization && tag.categorization.display_name) {
        tag.categorization.displayName = tag.categorization.display_name;

        delete(tag.categorization.display_name);
      }
    }

    if (serviceTemplates) {
      vm.serviceTemplates = serviceTemplates.resources;
    }

    if (vm.blueprint && vm.serviceTemplates && vm.blueprint.ui_properties
      && vm.blueprint.ui_properties.chart_data_model && vm.blueprint.ui_properties.chart_data_model.nodes
      && vm.blueprint.ui_properties.chart_data_model.nodes.length > 0) {
      updateCanvasServiceTemplateNodes(vm.serviceTemplates, vm.blueprint.ui_properties.chart_data_model.nodes);
    }

    function updateCanvasServiceTemplateNodes(serviceTemplates, nodes) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var foundNodesSrvTemplate = false;
        for (var t = 0; t < serviceTemplates.length; t++) {
          var srvTemplate = serviceTemplates[t];
          if (node.id === srvTemplate.id) {
            node.name = srvTemplate.name;
            if (srvTemplate.picture && srvTemplate.picture.image_href) {
              node.image = srvTemplate.picture.image_href;
            } else if (!node.bundle) {
              node.image = "images/service.png";
            } else {
              node.image = null;
            }
            // This service template is already on the canvas
            // disable it in toolbox
            srvTemplate.disableInToolbox = true;
            foundNodesSrvTemplate = true;
            break;
          }
        }
        if (!foundNodesSrvTemplate) {
          $log.error("Cound Not Find Service Template for Canvas Node: " + node.name + "(" + node.id + ")");
        }
      }
    }
  }
})();

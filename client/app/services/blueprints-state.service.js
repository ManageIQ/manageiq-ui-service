(function() {
  'use strict';

  angular.module('app.services')
      .factory('BlueprintsState', BlueprintsStateFactory);

  /** @ngInject */
  function BlueprintsStateFactory($filter, CollectionsApi, Notifications, $state, sprintf, $q) {
    var blueprint = {};

    blueprint.sort = {
      isAscending: true,
      currentField: {id: 'name', title: __('Name'), sortType: 'alpha'}
    };

    blueprint.filters = [];

    blueprint.setSort = function(currentField, isAscending) {
      blueprint.sort.isAscending = isAscending;
      blueprint.sort.currentField = currentField;
    };

    blueprint.getSort = function() {
      return blueprint.sort;
    };

    blueprint.setFilters = function(filterArray) {
      blueprint.filters = filterArray;
    };

    blueprint.getFilters = function() {
      return blueprint.filters;
    };

    blueprint.newCatalogs = [];

    blueprint.selectedBlueprints = [];

    blueprint.handleSelectionChange = function(tmpBlueprint) {
      if (tmpBlueprint.selected) {
        blueprint.selectedBlueprints.push(tmpBlueprint);
      } else {
        blueprint.unselectBlueprint(tmpBlueprint.id);
      }
    };

    blueprint.getSelectedBlueprints = function() {
      return blueprint.selectedBlueprints;
    };

    blueprint.unselectBlueprints = function() {
      blueprint.selectedBlueprints = [];
    };

    blueprint.unselectBlueprint = function(id) {
      var index = findWithAttr(blueprint.selectedBlueprints, 'id', id);
      if (index !== -1) {
        blueprint.selectedBlueprints.splice(index, 1);
      }
    };

    blueprint.setBlueprints = function(blueprints) {
      blueprint.blueprints = blueprints;
    };

    blueprint.getBlueprints = function() {
      return blueprint.blueprints;
    };

    blueprint.getNewCatalogs = function() {
      return blueprint.newCatalogs;
    };

    blueprint.addNewCatalog = function(newCat) {
      blueprint.newCatalogs.push(newCat);
    };

    blueprint.getNextUniqueId = function() {
      return blueprint.blueprints.length;
    };

    blueprint.duplicateBlueprint = function(origBlueprint) {
      var newBlueprint = angular.copy(origBlueprint);
      newBlueprint.id = blueprint.getNextUniqueId();
      newBlueprint.name = getCopyName(newBlueprint.name);
      blueprint.blueprints.push(newBlueprint);
    };

    blueprint.origBlueprint = null;

    blueprint.saveOriginalBlueprint = function(origBlueprint) {
      blueprint.origBlueprint = origBlueprint;
      blueprint.setDoNotSave(false);
    };

    blueprint.getOriginalBlueprint = function() {
      return blueprint.origBlueprint;
    };

    blueprint.doNotSaveFlag = false;

    blueprint.setDoNotSave = function(value) {
      blueprint.doNotSaveFlag = value;
    };

    blueprint.doNotSave = function() {
      return blueprint.doNotSaveFlag;
    };

    blueprint.saveBlueprint = function(tmpBlueprint) {

      var deferred = $q.defer();

      if (tmpBlueprint.ui_properties && tmpBlueprint.ui_properties.chartDataModel  && tmpBlueprint.ui_properties.chartDataModel.nodes) {
        tmpBlueprint.num_items = tmpBlueprint.ui_properties.chartDataModel.nodes.length;
      } else {
        tmpBlueprint.num_items = 0;
      }

      var blueprintObj = getBlueprintPostObj(tmpBlueprint);

      if (tmpBlueprint.id) {
        CollectionsApi.post('blueprints', tmpBlueprint.id, {}, blueprintObj).then(updateSuccess, updateFailure);
      } else {
        CollectionsApi.post('blueprints', null, {}, blueprintObj).then(createSuccess, createFailure);
      }

      function getBlueprintPostObj(tmpBlueprint) {

        // console.log("SDUI Blueprint: " + angular.toJson(tmpBlueprint, true));

        var blueprintObj = {
          "name": tmpBlueprint.name,
          "description": "description",
          "bundle": {},
          "ui_properties": {}
        };

        if (tmpBlueprint.ui_properties && tmpBlueprint.ui_properties.chartDataModel) {
          var chartDataModel = tmpBlueprint.ui_properties.chartDataModel;
          blueprintObj.ui_properties.chartDataModel = chartDataModel;
          if (chartDataModel.nodes) {
            var serviceTemplates = [];
            for (var i = 0; i < chartDataModel.nodes.length; i++) {
              var nodeSrvTemplate = chartDataModel.nodes[i];
              serviceTemplates.push({"id": nodeSrvTemplate.id});
            }
            blueprintObj.bundle.service_templates = serviceTemplates;
          }
        }

        if (tmpBlueprint.bundle.service_template_catalog_id) {
          blueprintObj.bundle.service_catalog = {"id": tmpBlueprint.bundle.service_template_catalog_id};
        }

        if (tmpBlueprint.bundle.service_template_dialog_id) {
          blueprintObj.bundle.service_dialog = {"id": tmpBlueprint.bundle.service_template_dialog_id};
        }

        if (tmpBlueprint.provEP || tmpBlueprint.reConfigEP || tmpBlueprint.retireEP ) {
          var automateEntrypoints = {};
          if (tmpBlueprint.provEP) {
            automateEntrypoints.Provision = tmpBlueprint.provEP;
          }
          if (tmpBlueprint.reConfigEP) {
            automateEntrypoints.Reconfigure = tmpBlueprint.reConfigEP;
          }
          if (tmpBlueprint.retireEP) {
            automateEntrypoints.Retire = tmpBlueprint.retireEP;
          }
          blueprintObj.bundle.automate_entrypoints = automateEntrypoints;
        }

        // Hack until backend returns multiple service templates and catalog name
        blueprintObj.ui_properties.num_items = tmpBlueprint.num_items;
        if (tmpBlueprint.ui_properties.catalog_name) {
          blueprintObj.ui_properties.catalog_name = tmpBlueprint.ui_properties.catalog_name;
        }

        if (tmpBlueprint.id) {
          blueprintObj.action = "edit";
        }

        // console.log("POST Blueprint Obj: " + angular.toJson(blueprintObj, true));

        return blueprintObj;
      }

      function updateSuccess() {
        Notifications.success(__(sprintf("%s blueprint was saved.", tmpBlueprint.name)));
        deferred.resolve();
      }

      function updateFailure() {
        Notifications.error(__('There was an error saving this blueprint.'));
        deferred.reject();
      }

      function createSuccess(response) {
        Notifications.success(__(sprintf("%s blueprint was created.", tmpBlueprint.name)));
        deferred.resolve(response.results[0].id);
      }

      function createFailure() {
        Notifications.error(__('There was an error creating this blueprint.'));
        deferred.reject();
      }

      return deferred.promise;
    };

    blueprint.deleteBlueprint = function(id) {
      var index = findBlueprintIndexById(id);
      if (index !== -1) {
        blueprint.unselectBlueprint(id);
        blueprint.blueprints.splice(index, 1);
      } else {
        console.log("cound not delete/find blueprint: id = " + id);
      }
    };

    blueprint.getNewBlueprintObj = function() {
      var tmpBlueprint = {};
      // tmpBlueprint.id = blueprint.getNextUniqueId();
      // tmpBlueprint.last_modified = new Date();
      tmpBlueprint.name = __('Untitled Blueprint ');
      tmpBlueprint.visibility = {"id": 800, "name": "Private"};
      tmpBlueprint.bundle = {};
      tmpBlueprint.ui_properties = {
        chartDataModel: {
          "nodeActions": [
            {
              "id": 1,
              "name": "connect",
              "fontFamily": "FontAwesome",
              "fontContent": "\uf1e0"
            },
            {
              "id": 2,
              "name": "edit",
              "fontFamily": "PatternFlyIcons-webfont",
              "fontContent": "\ue60a"
            },
            {
              "id": 3,
              "name": "tag",
              "fontFamily": "FontAwesome",
              "fontContent": "\uf02b"
            }
          ]
        }
      };

      blueprint.setDoNotSave(false);

      return tmpBlueprint;
    };

    blueprint.getBlueprintById = function(id) {
      /*
      for (var i = 0; i < blueprint.blueprints.length; i++) {
        if (blueprint.blueprints[i].id.toString() === id.toString()) {
          return blueprint.blueprints[i];
        }
      }

      return {};
      */
      return CollectionsApi.get('blueprints', id, {});
    };

    function findBlueprintIndexById(id) {
      for (var i = 0; i < blueprint.blueprints.length; i++) {
        if (blueprint.blueprints[i].id === id) {
          return i;
        }
      }

      return -1;
    }

    function findWithAttr(array, attr, value) {
      for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
          return i;
        }
      }

      return -1;
    }

    function getCopyName(baseName) {
      var baseNameLength = baseName.indexOf(' Copy');

      if (baseNameLength === -1) {
        baseNameLength = baseName.length;
      }

      baseName = baseName.substr(0, baseNameLength);

      var filteredArray = $filter('filter')( blueprint.blueprints, {name: baseName}, false);

      var copyName = baseName + " Copy" + ((filteredArray.length === 1) ? "" : " " + filteredArray.length) ;

      return copyName;
    }

    return blueprint;
  }
})();

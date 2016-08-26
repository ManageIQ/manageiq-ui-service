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

    blueprint.origBlueprint = null;
    blueprint.selectedBlueprints = [];
    blueprint.doNotSaveFlag = false;

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

    blueprint.saveOriginalBlueprint = function(origBlueprint) {
      blueprint.origBlueprint = origBlueprint;
      blueprint.setDoNotSave(false);
    };

    blueprint.getOriginalBlueprint = function() {
      return blueprint.origBlueprint;
    };

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

      // console.log("Saving Blueprint: " + angular.toJson(blueprintObj, true));

      if (tmpBlueprint.id) {
        CollectionsApi.post('blueprints', tmpBlueprint.id, {}, blueprintObj).then(updateSuccess, updateFailure);
      } else {
        CollectionsApi.post('blueprints', null, {}, blueprintObj).then(createSuccess, createFailure);
      }

      function getBlueprintPostObj(tmpBlueprint) {                                    // jshint ignore:line
        var blueprintObj = {
          "name": tmpBlueprint.name,
          "description": "description",
          "bundle": {},
          "ui_properties": {}
        };

        if (tmpBlueprint.ui_properties && tmpBlueprint.ui_properties.chartDataModel) {
          var chartDataModel = tmpBlueprint.ui_properties.chartDataModel;
          if (chartDataModel.nodes) {
            var serviceTemplates = [];
            for (var i = 0; i < chartDataModel.nodes.length; i++) {
              var nodeSrvTemplate = chartDataModel.nodes[i];
              if (nodeSrvTemplate.id) {
                serviceTemplates.push({"id": nodeSrvTemplate.id});
              } else {
                Notifications.warn("Cannot Save New Generic Item '" + nodeSrvTemplate.name +
                    "'.  Saving New Generic Items Not Yet Implemented.");
              }
            }
            blueprintObj.bundle.service_templates = serviceTemplates;
          }
          blueprintObj.ui_properties.chartDataModel = chartDataModel;
        }

        if (tmpBlueprint.content.service_catalog) {
          if (tmpBlueprint.content.service_catalog.id !== -1) {
            blueprintObj.bundle.service_catalog = {"id": tmpBlueprint.content.service_catalog.id};
          } else {
            blueprintObj.bundle.service_catalog = null;
          }
        }

        if (tmpBlueprint.content.service_dialog) {
          if (tmpBlueprint.content.service_dialog.id !== -1) {
            blueprintObj.bundle.service_dialog = {"id": tmpBlueprint.content.service_dialog.id};
          } else {
            blueprintObj.bundle.service_dialog = null;
          }
        }

        var automateEntrypoints = {};
        for (var e = 0; e < tmpBlueprint.content.automate_entrypoints.length; e++) {
          var aep = tmpBlueprint.content.automate_entrypoints[e];
          var newAepStr = blueprint.getEntryPointString(aep);
          switch (aep.action) {
            case "Provision":
              automateEntrypoints.Provision = newAepStr;
              break;
            case "Reconfigure":
              automateEntrypoints.Reconfigure = newAepStr;
              break;
            case "Retirement":
              automateEntrypoints.Retirement = newAepStr;
              break;
          }
        }

        // console.log("Saving Entry Points: " + angular.toJson(automateEntrypoints, true));

        blueprintObj.bundle.automate_entrypoints = automateEntrypoints;

        blueprintObj.ui_properties.num_items = tmpBlueprint.num_items;

        if (tmpBlueprint.id) {
          blueprintObj.action = "edit";
        }

        return blueprintObj;
      }

      function updateSuccess(response) {
        Notifications.success(__(sprintf("%s blueprint was saved.", tmpBlueprint.name)));
        deferred.resolve(response.id);
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

    blueprint.deleteBlueprints = function(blueprints) {
      var deferred = $q.defer();

      var resources = [];
      for (var i = 0; i < blueprints.length; i++) {
        resources.push({"id": blueprints[i].id});
      }

      var blueprintObj = {
        "action": "delete",
        "resources": resources
      };

      CollectionsApi.post('blueprints', null, {}, blueprintObj).then(deleteSuccess, deleteFailure);

      function deleteSuccess() {
        Notifications.success(__('Blueprint(s) were succesfully deleted.'));
        deferred.resolve();
      }

      function deleteFailure() {
        Notifications.error(__('There was an error deleting the blueprint(s).'));
        deferred.reject();
      }

      return deferred.promise;
    };

    blueprint.getEntryPointString = function(aep) {
      var newAepStr = "";
      newAepStr += ((aep.ae_namespace && aep.ae_namespace.length) ? (aep.ae_namespace) : "");
      newAepStr += ((aep.ae_class && aep.ae_class.length) ? ("\/" + aep.ae_class) : "");
      newAepStr += ((aep.ae_instance && aep.ae_instance.length) ? ("\/" + aep.ae_instance) : "");

      return newAepStr;
    };

    blueprint.getNewBlueprintObj = function() {
      var tmpBlueprint = {};
      tmpBlueprint.name = __('Untitled Blueprint');
      // tmpBlueprint.visibility = {"id": 800, "name": "Private"};
      tmpBlueprint.bundle = {};
      // TODO Need to get full default paths
      tmpBlueprint.content = {automate_entrypoints: [
        {"action": "Provision",
        "ae_namespace": "Service/Provisioning/StateMachines",
        "ae_class": "ServiceProvision_Template",
        "ae_instance": "default"}
      ]};
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
          ],
          "nodes": []
        }
      };

      blueprint.setDoNotSave(false);

      return tmpBlueprint;
    };

    blueprint.difference = function(o1, o2) {
      var k;
      var kDiff;
      var diff = {};

      for (k in o1) {  // jshint ignore:line
        if (!o1.hasOwnProperty(k)) {
          console.log("obj 2 doesn't have " + k);
        } else if (typeof o1[k] !== 'object' || typeof o2[k] !== 'object') {
          if (!(k in o2) || o1[k] !== o2[k]) {
            diff[k] = o2[k];
          }
        } else if (kDiff = blueprint.difference(o1[k], o2[k])) {    // jshint ignore:line
          diff[k] = kDiff;
        }
      }
      for (k in o2) {
        if (o2.hasOwnProperty(k) && !(k in o1)) {
          diff[k] = o2[k];
        }
      }
      for (k in diff) {
        if (diff.hasOwnProperty(k)) {
          return diff;
        }
      }

      return false;
    };

    function findWithAttr(array, attr, value) {
      for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
          return i;
        }
      }

      return -1;
    }

    return blueprint;
  }
})();

/* eslint camelcase: "off" */
(function() {
  'use strict';

  angular.module('app.services')
    .factory('BlueprintsState', BlueprintsStateFactory);

  /** @ngInject */
  function BlueprintsStateFactory(CollectionsApi, EventNotifications, $log, $q) {
    var blueprint = {};

    blueprint.sort = {
      isAscending: true,
      currentField: {id: 'name', title: __('Name'), sortType: 'alpha'},
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

      saveBlueprintProperties(tmpBlueprint).then(function(id) {
        $log.info("'" + tmpBlueprint.name + "' Blueprint Properties were saved.");
        saveBlueprintTags(id, tmpBlueprint).then(function() {
          $log.info("'" + tmpBlueprint.name + "' Blueprint Tags were saved.");
          deferred.resolve(id);
        }, saveTagsfailure);
      }, savePropsfailure);

      function savePropsfailure() {
        deferred.reject();
      }

      function saveTagsfailure() {
        deferred.reject();
      }

      function saveServiceItemTagsfailure() {
        deferred.reject();
      }

      return deferred.promise;
    };

    function saveBlueprintProperties(tmpBlueprint) {
      var deferred = $q.defer();

      var blueprintObj = getBlueprintPostObj(tmpBlueprint);

      // $log.debug("Saving Blueprint: " + angular.toJson(blueprintObj, true));

      if (tmpBlueprint.id) {
        CollectionsApi.post('blueprints', tmpBlueprint.id, {}, blueprintObj).then(updateSuccess, updateFailure);
      } else {
        CollectionsApi.post('blueprints', null, {}, blueprintObj).then(createSuccess, createFailure);
      }

      function updateSuccess(response) {
        deferred.resolve(response.id);
      }

      function updateFailure() {
        $log.error('There was an error saving this blueprints properties.');
        deferred.reject();
      }

      function createSuccess(response) {
        deferred.resolve(response.results[0].id);
      }

      function createFailure() {
        $log.error('There was an error creating this blueprint.');
        deferred.reject();
      }

      function getBlueprintPostObj(tmpBlueprint) {                                    // jshint ignore:line
        var blueprintObj = {
          "name": tmpBlueprint.name,
          "description": tmpBlueprint.description,
          "ui_properties": tmpBlueprint.ui_properties,
        };

        blueprintObj.ui_properties.num_items = tmpBlueprint.ui_properties.chart_data_model.nodes.length;

        if (tmpBlueprint.id) {
          blueprintObj.action = "edit";
        }

        return blueprintObj;
      }

      return deferred.promise;
    }

    function saveBlueprintTags(blueprintId, tmpBlueprint) {
      var deferred = $q.defer();

      var blueprintTags = tmpBlueprint.tags;
      var origBlueprintTags = blueprint.getOriginalBlueprint().tags;
      var assignObj = getTagsToAddRemove("assign", blueprintTags, origBlueprintTags);
      var unassignObj = getTagsToAddRemove("unassign", blueprintTags, origBlueprintTags);

      var collection = 'blueprints/' + blueprintId + '/tags';

      if (assignObj.resources.length > 0) {
        CollectionsApi.post(collection, null, {}, assignObj).then(function() {
          $log.info("  Blueprint tags assigned succesfully.");
          if (unassignObj.resources.length > 0) {
            CollectionsApi.post(collection, null, {}, unassignObj).then(function() {
              $log.info("  Blueprint tags unassigned succesfully.");
              deferred.resolve();
            }, assignFailure);
          } else {
            deferred.resolve();
          }
        }, unassignFailure);
      } else {
        if (unassignObj.resources.length > 0) {
          CollectionsApi.post(collection, null, {}, unassignObj).then(function() {
            $log.info("  Blueprint tags unassigned succesfully.");
            deferred.resolve();
          }, assignFailure);
        } else {
          deferred.resolve();
        }
      }

      function assignFailure() {
        $log.error('There was an error assigning blueprint tags.');
        deferred.reject();
      }

      function unassignFailure() {
        $log.error('There was an error unassigning blueprint tags.');
        deferred.reject();
      }

      return deferred.promise;
    }

    function getTagsToAddRemove(action, tags, origTags) {
      var resultObj = {
        "action": action,
        "resources": [],
      };
      var resources = [];

      var foundInOther, matchTag, tag ;

      // if blueprintTag not in origBlueprintTags, assign
      var bpComp1 = tags;
      var bpComp2 = origTags;

      if (action === "unassign") {
        // if origBlueprintTag not in blueprintTags, it was removed, unassign
        bpComp1 = origTags;
        bpComp2 = tags;
      }

      for (var i = 0; i < bpComp1.length; i++) {
        tag = bpComp1[i];
        foundInOther = false;
        for (var t = 0; t < bpComp2.length; t++) {
          matchTag = bpComp2[t];
          if (tag.id === matchTag.id) {
            foundInOther = true;
            break;
          }
        }
        if (!foundInOther) {
          // $log.debug("--> " + action + " " + tag.id + " - " + tag.categorization.display_name);
          resources.push({id: tag.id});
        }
      }

      resultObj.resources = resources;

      return resultObj;
    }

    blueprint.deleteBlueprints = function(blueprints) {
      var deferred = $q.defer();

      var resources = [];
      for (var i = 0; i < blueprints.length; i++) {
        resources.push({"id": blueprints[i].id});
      }

      var blueprintObj = {
        "action": "delete",
        "resources": resources,
      };

      CollectionsApi.post('blueprints', null, {}, blueprintObj).then(deleteSuccess, deleteFailure);

      function deleteSuccess() {
        EventNotifications.success(__('Blueprint(s) were succesfully deleted.'));
        deferred.resolve();
      }

      function deleteFailure() {
        EventNotifications.error(__('There was an error deleting the blueprint(s).'));
        deferred.reject();
      }

      return deferred.promise;
    };

    blueprint.getNewBlueprintObj = function() {
      var tmpBlueprint = {};
      tmpBlueprint.name = __('Untitled Blueprint');
      // tmpBlueprint.visibility = {"id": 800, "name": "Private"};
      tmpBlueprint.tags = [];
      // TODO Need to get default Provision entry point
      tmpBlueprint.ui_properties = {
        automate_entrypoints: {Provision: "Service/Provisioning/StateMachines/ServiceProvision_Template/default"},
        chart_data_model: {
          "nodes": [],
        },
      };

      blueprint.setDoNotSave(false);

      return tmpBlueprint;
    };

    blueprint.difference = function(o1, o2) {
      var k, kDiff;
      var diff = {};

      for (k in o1) {  // jshint ignore:line
        if (!o1.hasOwnProperty(k)) {
          $log.warn("obj 2 doesn't have " + k);
        } else if (!angular.isObject(o1[k]) || !angular.isObject(o2[k]) ) {
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

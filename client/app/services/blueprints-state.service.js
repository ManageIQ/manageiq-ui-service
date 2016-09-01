(function() {
  'use strict';

  angular.module('app.services')
      .factory('BlueprintsState', BlueprintsStateFactory);

  /** @ngInject */
  function BlueprintsStateFactory($filter) {
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

    blueprint.saveBlueprint = function(tmpBlueprint) {
      tmpBlueprint.last_modified = new Date();
      if (tmpBlueprint.chartDataModel && tmpBlueprint.chartDataModel.nodes) {
        tmpBlueprint.num_nodes = tmpBlueprint.chartDataModel.nodes.length;
      } else {
        tmpBlueprint.num_nodes = 0;
      }

      var index = findBlueprintIndexById(tmpBlueprint.id);
      if (index === -1) {
        blueprint.blueprints.push(tmpBlueprint);
      } else {
        blueprint.blueprints[index] = tmpBlueprint;
      }

      // console.log("Saved Blueprint: " + angular.toJson(tmpBlueprint, true));

      return;
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
      tmpBlueprint.id = blueprint.getNextUniqueId();
      tmpBlueprint.last_modified = new Date();
      tmpBlueprint.name = __('Untitled Blueprint ') + tmpBlueprint.id;
      tmpBlueprint.visibility = {"id": 800, "name": "Private"};
      tmpBlueprint.chartDataModel = {
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
      };

      return tmpBlueprint;
    };

    blueprint.getBlueprintById = function(id) {
      for (var i = 0; i < blueprint.blueprints.length; i++) {
        if (blueprint.blueprints[i].id.toString() === id.toString()) {
          return blueprint.blueprints[i];
        }
      }

      return {};
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

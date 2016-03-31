
(function() {
  'use strict';

  angular.module('app.services')
    .factory('BlueprintsState', BlueprintsStateFactory);

  /** @ngInject */
  function BlueprintsStateFactory() {
    var blueprint = {};

    blueprint.sort = {
      isAscending: true,
      currentField: { id: 'name', title: __('Name'), sortType: 'alpha' }
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

    blueprint.blueprints = [
      {
        "id": 0,
        "name": "Create RDS Instance",
        "last_modified": "2014-09-08T16:17:40Z",
        "num_nodes": 0,
        "visibility": {
          "id": 800,
          "name": "Private"
        },
        "catalog": {
          "id": -1,
          "name": "Unassigned"
        },
        "dialog": {
          "id": -1,
          "name": "Select Dialog"
        }
      },
      {
        "id": 1,
        "name": "Create S3 Bucket",
        "last_modified": "2015-04-16T18:24:21Z",
        "num_nodes": 0,
        "visibility": {
          "id": 1000000000004,
          "name": "Project 1"
        },
        "catalog": {
          "id": 1000000000007,
          "name": "Amazon Operations"
        },
        "dialog": {
          "id": 1000000000014,
          "name": "AWScreate_vpc"
        }
      },
      {
        "id": 2,
        "name": "Dev DB Server",
        "last_modified": "2015-01-16T18:24:21Z",
        "num_nodes": 0,
        "visibility": {
          "id": 900,
          "name": "Public"
        },
        "catalog": {
          "id": -1,
          "name": "Unassigned"
        },
        "dialog": {
          "id": -1,
          "name": "Select Dialog"
        }
      },
      {
        "id": 3,
        "name": "Amazon DEV Instance",
        "last_modified": "2016-02-23T11:08:22Z",
        "num_nodes": 0,
        "visibility": {
          "id": 1000000000001,
          "name": "My Company"
        },
        "catalog": {
          "id": 1000000000003,
          "name": "DevOps Team Alpha"
        },
        "dialog": {
          "id": 1000000000001,
          "name": "RenameVM"
        }
      }
    ];

    blueprint.selectedBlueprints = [];

    blueprint.handleSelectionChange = function (tmpBlueprint) {
      if(tmpBlueprint.selected){
        blueprint.selectedBlueprints.push(tmpBlueprint);
      } else {
        var index = findWithAttr(blueprint.selectedBlueprints, 'id', tmpBlueprint.id);
        if (index != -1) {
          blueprint.selectedBlueprints.splice(index, 1);
        } else {
          console.log("Cound't find blueprint to unselect.");
        }
      }
    };

    blueprint.getSelectedBlueprints = function () {
      return blueprint.selectedBlueprints;
    };

    blueprint.unselectBlueprints = function () {
      blueprint.selectedBlueprints = [];
    };

    blueprint.getBlueprints = function() {
      return blueprint.blueprints;
    };

    blueprint.getNextUniqueId = function () {
      return blueprint.blueprints.length;
    }

    blueprint.saveBlueprint = function(tmpBlueprint) {
      tmpBlueprint.last_modified = new Date();
      if(tmpBlueprint.chartDataModel && tmpBlueprint.chartDataModel.nodes) {
        tmpBlueprint.num_nodes = tmpBlueprint.chartDataModel.nodes.length;
      } else {
        tmpBlueprint.num_nodes = 0;
      }

      var index = findBlueprintIndexById(tmpBlueprint.id);
      if (index === -1) {
        //console.log("Saving new blueprint " + tmpBlueprint.id);
        tmpBlueprint.id = blueprint.getNextUniqueId();
        //console.log("Saving new blueprint " + tmpBlueprint.id);
        blueprint.blueprints.push(tmpBlueprint);
      } else {
        blueprint.blueprints[index] = tmpBlueprint;
      }

      return tmpBlueprint.id;
    };

    blueprint.deleteBlueprint = function(id) {
      var index = findBlueprintIndexById(id);
      if (index !== -1) {
        blueprint.blueprints.splice(index, 1);
      }
    };

    blueprint.getBlueprints = function() {
      return blueprint.blueprints;
    };

    blueprint.getBlueprintById = function(id) {
      for (var i = 0; i < blueprint.blueprints.length; i++) {
        if (blueprint.blueprints[i].id.toString() === id) {
          return blueprint.blueprints[i];
        }
      }

      return {};
    };

    function findBlueprintIndexById(id) {
      for (var i = 0; i <  blueprint.blueprints.length; i++) {
        if (blueprint.blueprints[i].id === id) {
          return i;
        }
      }

      return -1;
    }

    function findWithAttr(array, attr, value) {
      for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
          return i;
        }
      }

      return -1;
    }

    return blueprint;
  }
})();

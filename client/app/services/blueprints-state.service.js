
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
      },
      {
        "id": 1,
        "name": "Create S3 Bucket",
      },
      {
        "id": 2,
        "name": "Dev DB Server",
      },
      {
        "id": 3,
        "name": "Amazon DEV Instance",
      }
    ];

    blueprint.getBlueprints = function() {
      return blueprint.blueprints;
    };

    blueprint.saveBlueprint = function(tmpBlueprint) {
      var index = findBlueprintIndexById(tmpBlueprint.id);
      if (index === -1) {
        tmpBlueprint.id = blueprint.blueprints.length;
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
        if (blueprint.blueprints[i].id === id) {
          return blueprint.blueprints[i];
        }
      }

      return null;
    };

    function findBlueprintIndexById(id) {
      for (var i = 0; i <  blueprint.blueprints.length; i++) {
        if (blueprint.blueprints[i].id === id) {
          return i;
        }
      }

      return -1;
    }

    return blueprint;
  }
})();

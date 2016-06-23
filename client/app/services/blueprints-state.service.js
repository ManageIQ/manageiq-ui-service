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
        "chartDataModel": {},
        "provEP": "path/to/default/prov/entry/point"
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
        },
        "chartDataModel": {},
        "provEP": "path/to/default/prov/entry/point"
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
        "dialog": {
          "id": 1000000000004,
          "name": "Project 1"
        },
        "chartDataModel": {},
        "provEP": "path/to/default/prov/entry/point"
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
        },
        "chartDataModel": {
          "nodes": [
            {
              "title": "AWS",
              "image": "assets/images/blueprint-designer/AWS-Logo.svg",
              "id": 10,
              "name": "AWS",
              "backgroundColor": "#fff",
              "x": 444,
              "y": 103,
              "width": 150,
              "provision_order": 0,
              "action_order": 0,
              inputConnectors: [
                {
                  name: "In"
                }
              ],
              outputConnectors: [
                {
                  name: "Out"
                }
              ]
            },
            {
              "title": "Azure",
              "image": "assets/images/blueprint-designer/Azure-Logo.svg",
              "id": 11,
              "name": "Azure",
              "backgroundColor": "#fff",
              "x": 211,
              "y": 25,
              "width": 150,
              "provision_order": 0,
              "action_order": 1
            },
            {
              "title": "GCE",
              "image": "assets/images/blueprint-designer/GCE_Logo.png",
              "id": 12,
              "name": "GCE",
              "backgroundColor": "#fff",
              "x": 44,
              "y": 197,
              "width": 150,
              "provision_order": 1,
              "action_order": 1
            },
            {
              "title": "Kubernetes",
              "image": "assets/images/blueprint-designer/kubernetes-Logo.svg",
              "id": 13,
              "name": "Kubernetes",
              "backgroundColor": "#fff",
              "x": 217,
              "y": 197,
              "width": 150,
              "provision_order": 1,
              "action_order": 1
            },
            {
              "title": "OpenStack",
              "image": "assets/images/blueprint-designer/Openstack-Logo.svg",
              "id": 14,
              "name": "OpenStack",
              "backgroundColor": "#fff",
              "x": 43,
              "y": 374,
              "width": 150,
              "provision_order": 2,
              "action_order": 1
            },
            {
              "title": "Bundle 3",
              "bundle": true,
              "id": 15,
              "name": "Bundle 3",
              "backgroundColor": "#fff",
              "x": 44,
              "y": 24,
              "width": 150,
              "provision_order": 2,
              "action_order": 2
            },
            {
              "title": "Bundle 2",
              "bundle": true,
              "id": 16,
              "name": "Bundle 2",
              "backgroundColor": "#fff",
              "x": 659,
              "y": 218,
              "width": 150,
              "provision_order": 3,
              "action_order": 2,
              inputConnectors: [
                {
                  name: "In 1"
                },
                {
                  name: "In 2"
                }
              ],
              outputConnectors: [
                {
                  name: " Out 1"
                },
                {
                  name: " Out 2"
                }
              ]
            }
          ],
          "connections": []
        },
        "provEP": "path/to/default/prov/entry/point"
      }
    ];

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

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('MockData', MockDataFactory);

  /** @ngInject */
  function MockDataFactory() {
    var service = {
      retrieveMockData: retrieveMockData
    };

    return service;

    function retrieveMockData(collection) {
      if (collection === 'blueprints') {
        return {
          "resources": [
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
              "num_nodes": 7,
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
          ]};
      } else if (collection === 'service_catalogs') {
        return { "resources": [
          {
          "href": "http://localhost:8001/api/service_catalogs/1000000000007",
          "id": 1000000000007,
          "name": "Amazon Operations",
          "description": "Amazon Operations",
          "tenant_id": 1000000000001,
          "service_templates": {
            "count": 6,
            "resources": [
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000007/service_templates/1000000000030"
              },
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000007/service_templates/1000000000029"
              },
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000007/service_templates/1000000000031"
              },
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000007/service_templates/1000000000032"
              },
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000007/service_templates/1000000000039"
              },
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000007/service_templates/1000000000038"
              }
            ]
          },
          "actions": [
            {
              "name": "edit",
              "method": "post",
              "href": "http://localhost:8001/api/service_catalogs/1000000000007"
            },
            {
              "name": "delete",
              "method": "post",
              "href": "http://localhost:8001/api/service_catalogs/1000000000007"
            },
            {
              "name": "delete",
              "method": "delete",
              "href": "http://localhost:8001/api/service_catalogs/1000000000007"
            }
          ]
        },
        {
          "href": "http://localhost:8001/api/service_catalogs/1000000000008",
          "id": 1000000000008,
          "name": "Amazon Services",
          "description": "Amazon Services",
          "tenant_id": 1000000000001,
          "service_templates": {
            "count": 1,
            "resources": [
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000008/service_templates/1000000000027"
              }
            ]
          },
          "actions": [
            {
              "name": "edit",
              "method": "post",
              "href": "http://localhost:8001/api/service_catalogs/1000000000008"
            },
            {
              "name": "delete",
              "method": "post",
              "href": "http://localhost:8001/api/service_catalogs/1000000000008"
            },
            {
              "name": "delete",
              "method": "delete",
              "href": "http://localhost:8001/api/service_catalogs/1000000000008"
            }
          ]
        },
        {
          "href": "http://localhost:8001/api/service_catalogs/1000000000004",
          "id": 1000000000004,
          "name": "Cloud Services",
          "description": "Cloud Services",
          "tenant_id": 1000000000001,
          "service_templates": {
            "count": 1,
            "resources": [
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000004/service_templates/1000000000017"
              }
            ]
          },
          "actions": [
            {
              "name": "edit",
              "method": "post",
              "href": "http://localhost:8001/api/service_catalogs/1000000000004"
            },
            {
              "name": "delete",
              "method": "post",
              "href": "http://localhost:8001/api/service_catalogs/1000000000004"
            },
            {
              "name": "delete",
              "method": "delete",
              "href": "http://localhost:8001/api/service_catalogs/1000000000004"
            }
          ]
        },
        {
          "href": "http://localhost:8001/api/service_catalogs/1000000000003",
          "id": 1000000000003,
          "name": "DevOps Team Alpha",
          "description": "All items for DevOps Team Alpha",
          "tenant_id": 1000000000001,
          "service_templates": {
            "count": 7,
            "resources": [
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000003/service_templates/1000000000037"
              },
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000003/service_templates/1000000000011"
              },
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000003/service_templates/1000000000013"
              },
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000003/service_templates/1000000000015"
              },
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000003/service_templates/1000000000016"
              },
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000003/service_templates/1000000000012"
              },
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000003/service_templates/1000000000014"
              }
            ]
          },
          "actions": [
            {
              "name": "edit",
              "method": "post",
              "href": "http://localhost:8001/api/service_catalogs/1000000000003"
            },
            {
              "name": "delete",
              "method": "post",
              "href": "http://localhost:8001/api/service_catalogs/1000000000003"
            },
            {
              "name": "delete",
              "method": "delete",
              "href": "http://localhost:8001/api/service_catalogs/1000000000003"
            }
          ]
        },
        {
          "href": "http://localhost:8001/api/service_catalogs/1000000000002",
          "id": 1000000000002,
          "name": "Division Apps",
          "description": "Apps for divisions",
          "tenant_id": 1000000000001,
          "service_templates": {
            "count": 0,
            "resources": []
          },
          "actions": [
            {
              "name": "edit",
              "method": "post",
              "href": "http://localhost:8001/api/service_catalogs/1000000000002"
            },
            {
              "name": "delete",
              "method": "post",
              "href": "http://localhost:8001/api/service_catalogs/1000000000002"
            },
            {
              "name": "delete",
              "method": "delete",
              "href": "http://localhost:8001/api/service_catalogs/1000000000002"
            }
          ]
        },
        {
          "href": "http://localhost:8001/api/service_catalogs/1000000000005",
          "id": 1000000000005,
          "name": "HEAT Templates",
          "description": "HEAT Templates",
          "tenant_id": 1000000000001,
          "service_templates": {
            "count": 1,
            "resources": [
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000005/service_templates/1000000000018"
              }
            ]
          },
          "actions": [
            {
              "name": "edit",
              "method": "post",
              "href": "http://localhost:8001/api/service_catalogs/1000000000005"
            },
            {
              "name": "delete",
              "method": "post",
              "href": "http://localhost:8001/api/service_catalogs/1000000000005"
            },
            {
              "name": "delete",
              "method": "delete",
              "href": "http://localhost:8001/api/service_catalogs/1000000000005"
            }
          ]
        },
        {
          "href": "http://localhost:8001/api/service_catalogs/1000000000006",
          "id": 1000000000006,
          "name": "Red Hat - PaaS",
          "description": "Platform as a Service",
          "tenant_id": 1000000000001,
          "service_templates": {
            "count": 3,
            "resources": [
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000006/service_templates/1000000000023"
              },
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000006/service_templates/1000000000024"
              },
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000006/service_templates/1000000000020"
              }
            ]
          },
          "actions": [
            {
              "name": "edit",
              "method": "post",
              "href": "http://localhost:8001/api/service_catalogs/1000000000006"
            },
            {
              "name": "delete",
              "method": "post",
              "href": "http://localhost:8001/api/service_catalogs/1000000000006"
            },
            {
              "name": "delete",
              "method": "delete",
              "href": "http://localhost:8001/api/service_catalogs/1000000000006"
            }
          ]
        },
        {
          "href": "http://localhost:8001/api/service_catalogs/1000000000001",
          "id": 1000000000001,
          "name": "ServiceFlex",
          "description": "ServiceFlex",
          "tenant_id": 1000000000001,
          "service_templates": {
            "count": 2,
            "resources": [
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000001/service_templates/1000000000004"
              },
              {
                "href": "http://localhost:8001/api/service_catalogs/1000000000001/service_templates/1000000000010"
              }
            ]
          },
          "actions": [
            {
              "name": "edit",
              "method": "post",
              "href": "http://localhost:8001/api/service_catalogs/1000000000001"
            },
            {
              "name": "delete",
              "method": "post",
              "href": "http://localhost:8001/api/service_catalogs/1000000000001"
            },
            {
              "name": "delete",
              "method": "delete",
              "href": "http://localhost:8001/api/service_catalogs/1000000000001"
            }
          ]
        }
        ]};
      } else if (collection === 'service_dialogs') {
        return { "resources": [
          {
            "href": "http://localhost:8001/api/service_dialogs/1000000000014",
            "id": 1000000000014,
            "description": "AWScreate_vpc"
          },
          {
            "href": "http://localhost:8001/api/service_dialogs/1000000000002",
            "id": 1000000000002,
            "description": "Clone to OpenStack"
          },
          {
            "href": "http://localhost:8001/api/service_dialogs/1000000000003",
            "id": 1000000000003,
            "description": "CloudClone"
          },
          {
            "href": "http://localhost:8001/api/service_dialogs/1000000000015",
            "id": 1000000000015,
            "description": "CreateRDS"
          },
          {
            "href": "http://localhost:8001/api/service_dialogs/1000000000006",
            "id": 1000000000006,
            "description": "DevOps Alpha"
          },
          {
            "href": "http://localhost:8001/api/service_dialogs/1000000000010",
            "id": 1000000000010,
            "description": "OpenShift Enterprise Configuration"
          },
          {
            "href": "http://localhost:8001/api/service_dialogs/1000000000012",
            "id": 1000000000012,
            "description": "ProvisionAWSELB"
          },
          {
            "href": "http://localhost:8001/api/service_dialogs/1000000000013",
            "id": 1000000000013,
            "description": "ProvisionS3Bucket"
          },
          {
            "href": "http://localhost:8001/api/service_dialogs/1000000000007",
            "id": 1000000000007,
            "description": "Ravello-SummitLAB"
          },
          {
            "href": "http://localhost:8001/api/service_dialogs/1000000000009",
            "id": 1000000000009,
            "description": "RenameVM"
          },
          {
            "href": "http://localhost:8001/api/service_dialogs/1000000000001",
            "id": 1000000000001,
            "description": "ServiceFlex"
          },
          {
            "href": "http://localhost:8001/api/service_dialogs/1000000000018",
            "id": 1000000000018,
            "description": "Test"
          },
          {
            "href": "http://localhost:8001/api/service_dialogs/1000000000017",
            "id": 1000000000017,
            "description": "test"
          },
          {
            "href": "http://localhost:8001/api/service_dialogs/1000000000016",
            "id": 1000000000016,
            "description": "TestDynDropdown"
          },
          {
            "href": "http://localhost:8001/api/service_dialogs/1000000000011",
            "id": 1000000000011,
            "description": "WebServers"
          },
          {
            "href": "http://localhost:8001/api/service_dialogs/1000000000008",
            "id": 1000000000008,
            "description": "wordpress_service_dialog"
          },
          {
            "href": "http://localhost:8001/api/service_dialogs/1",
            "id": 1
          }
        ]};
      } else if (collection === 'service_templates') {
        return { "resources": [
          {
            "href": "http://localhost:8001/api/service_templates/1000000000037",
            "id": 1000000000037,
            "name": "testDropdown",
            "description": "TestDropdown",
            "guid": "f33b7a36-42ca-11e4-b745-005056b3585a",
            "options": {},
            "created_at": "2014-09-23T02:40:16Z",
            "updated_at": "2014-09-23T02:40:16Z",
            "display": true,
            "service_type": "atomic",
            "prov_type": "generic",
            "service_template_catalog_id": 1000000000003,
            "long_description": "",
            "tenant_id": 1000000000001,
            "service_template_catalog": {
              "name": "DevOps Team Alpha"
            },
            "actions": [
              {
                "name": "edit",
                "method": "post",
                "href": "http://localhost:8001/api/service_templates/1000000000037"
              },
              {
                "name": "delete",
                "method": "delete",
                "href": "http://localhost:8001/api/service_templates/1000000000037"
              }
            ]
          },
          {
            "href": "http://localhost:8001/api/service_templates/1000000000039",
            "id": 1000000000039,
            "name": "A_Test2",
            "description": "A_Test2",
            "guid": "b4bb271e-1ff8-11e5-835f-54ee751077a8",
            "options": {},
            "created_at": "2015-07-01T13:54:34Z",
            "updated_at": "2015-07-01T13:54:34Z",
            "display": true,
            "service_type": "atomic",
            "prov_type": "generic",
            "service_template_catalog_id": 1000000000007,
            "long_description": "",
            "tenant_id": 1000000000001,
            "service_template_catalog": {
              "name": "Amazon Operations"
            },
            "actions": [
              {
                "name": "edit",
                "method": "post",
                "href": "http://localhost:8001/api/service_templates/1000000000039"
              },
              {
                "name": "delete",
                "method": "delete",
                "href": "http://localhost:8001/api/service_templates/1000000000039"
              }
            ]
          },
          {
            "href": "http://localhost:8001/api/service_templates/1000000000038",
            "id": 1000000000038,
            "name": "A_Test1",
            "description": "A_test1",
            "guid": "8c130f3e-1ff8-11e5-835f-54ee751077a8",
            "options": {
              "button_order": [
                "cbg-1000000000163"
              ]
            },
            "created_at": "2015-07-01T13:53:26Z",
            "updated_at": "2015-08-06T16:33:40Z",
            "display": true,
            "service_type": "composite",
            "service_template_catalog_id": 1000000000007,
            "long_description": "",
            "tenant_id": 1000000000001,
            "service_template_catalog": {
              "name": "Amazon Operations"
            },
            "actions": [
              {
                "name": "edit",
                "method": "post",
                "href": "http://localhost:8001/api/service_templates/1000000000038"
              },
              {
                "name": "delete",
                "method": "delete",
                "href": "http://localhost:8001/api/service_templates/1000000000038"
              }
            ]
          }
        ]
        };
      } else if (collection === 'tenants') {
        return { "resources": [
          {
            "href": "http://localhost:8001/api/tenants/1",
            "id": 1,
            "name": "My Company"
          },
          {
            "href": "http://localhost:8001/api/tenants/1000000000001",
            "id": 1000000000001,
            "name": "My Company"
          },
          {
            "href": "http://localhost:8001/api/tenants/1000000000004",
            "id": 1000000000004,
            "name": "Project 1"
          },
          {
            "href": "http://localhost:8001/api/tenants/1000000000002",
            "id": 1000000000002,
            "name": "Test 1"
          },
          {
            "href": "http://localhost:8001/api/tenants/1000000000003",
            "id": 1000000000003,
            "name": "Test 2"
          }
        ]};
      }
    }
  }
})();

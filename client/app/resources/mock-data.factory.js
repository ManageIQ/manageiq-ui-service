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

      if(collection == 'service_catalogs'){
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
        ]}
      } else if(collection == 'service_dialogs'){
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
        ]}
      } else if(collection == 'tenants'){
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
        ]}
      }
    }
  }
})();

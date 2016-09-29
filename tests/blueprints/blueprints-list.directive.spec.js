describe('app.components.blueprints.BlueprintsListDirective', function() {
  var $scope;
  var $compile;
  var element;
  var successResponse = {
    message: 'Success!'
  };

  beforeEach(function () {
    module('app.services', 'app.config', 'app.states', 'gettext');
    bard.inject('BlueprintsState', '$state', 'Session', '$httpBackend');
  });

  beforeEach(inject(function (_$compile_, _$rootScope_, _$document_) {
    $compile = _$compile_;
    $scope = _$rootScope_;
    $document = _$document_
  }));

  var compileHTML = function (markup, scope) {
    element = angular.element(markup);
    $compile(element)(scope);

    scope.$digest();
  };

  beforeEach(function () {
    Session.create({
      auth_token: 'b10ee568ac7b5d4efbc09a6b62cb99b8',
    });
    $httpBackend.whenGET('').respond(200);

    $scope.blueprints = getBlueprints();
    $scope.serviceCatalogs = getServiceCatalogs();
    $scope.tenants = getTenants();

    var htmlTmp = '<blueprints-list blueprints="blueprints" service-catalogs="serviceCatalogs" tenants="tenants"/>';

    compileHTML(htmlTmp, $scope);
  });

  describe('Blueprints List', function() {
    it('should have correct number of rows', function () {
      var rows = element.find('.list-view-pf > .list-group-item');
      expect(rows.length).to.eq($scope.blueprints.length);
    });

    it('should have gotten catalog names from catalog ids', function () {
      var catName0 = element.find('#catalogName_0');
      var catName1 = element.find('#catalogName_1');
      var catName2 = element.find('#catalogName_2');

      expect(catName0.html()).to.eq("Amazon Operations");
      expect(catName1.html()).to.eq("OpenStack Operations");
      expect(catName2.html()).to.eq("Unassigned");
    });

    it('should display the correct Visibility icons', function () {
      var publicIcon = element.find('.fa.fa-globe');
      var privateIcon = element.find('.pficon.pficon-private');
      var tenantIcon = element.find('.pficon.pficon-tenant');

      expect(publicIcon.length).to.eq(1);
      expect(privateIcon.length).to.eq(1);
      expect(tenantIcon.length).to.eq(1);
    });

    it('should enable/disable delete blueprint button', function () {
      var rows = element.find('.list-view-pf > .list-group-item');
      expect(rows.length).to.eq($scope.blueprints.length);

      var disabledDeleteButton = element.find('.primary-action[disabled]');
      expect(disabledDeleteButton.length).to.eq(1);

      var checkboxes = rows.find('input');
      expect(checkboxes.length).to.eq(3);

      checkboxes[0].click();
      $scope.$digest();

      disabledDeleteButton = element.find('.primary-action[disabled]');
      expect(disabledDeleteButton.length).to.eq(0);
    });

    it('should enable/disable inline publish buttons', function () {

      var rows = element.find('.list-view-pf > .list-group-item');
      expect(rows.length).to.eq($scope.blueprints.length);

      // When 0 Items on Canvas, Publish button is disabled
      var secondRowNumItems = element.find('#numItems_1');
      var secondRowNumItemsStr = angular.element(secondRowNumItems[0]).html();
      secondRowNumItemsStr = secondRowNumItemsStr.substr(0,secondRowNumItemsStr.indexOf(' '));
      expect(secondRowNumItemsStr).to.eq('0');

      var disabledPublishButton = angular.element(rows[1]).find('.btn.btn-default.disabled');
      expect(disabledPublishButton.length).to.eq(1);

      // Third row has 3 Items on Canvas, so publish button should be enabled
      disabledPublishButton = angular.element(rows[2]).find('.btn.btn-default.disabled');
      expect(disabledPublishButton.length).to.eq(0);
    });
  });

  function getBlueprints() {
    return [
      {
        "href": "http://localhost:8001/api/blueprints/10000000000025",
        "id": 10000000000025,
        "name": "Blueprint Two",
        "ui_properties": {
          "num_items": 3,
          "visibility": {
            "id": 800,
            "name": "Private"
          },
          "chart_data_model": {
            "nodes": [
              {
                "x": 35,
                "y": 54,
                "id": 10000000000004,
                "icon": "pf pficon-bundle",
                "name": "Deploy RHEL7 with PostgreSQL",
                "tags": [
                  {
                    "id": 10000000000004,
                    "category": {
                      "id": 10000000000001
                    },
                    "categorization": {
                      "displayName": "Location: New York"
                    }
                  }
                ],
                "image": "http://localhost:8001/pictures/10r4.jpg",
                "width": 150,
                "bundle": true,
                "fontFamily": "PatternFlyIcons-webfont",
                "fontContent": "",
                "backgroundColor": "#fff"
              },
              {
                "x": 451,
                "y": 60,
                "id": 10000000000010,
                "icon": "pf pficon-bundle",
                "name": "Hybrid Cloud Application",
                "tags": [
                  {
                    "id": 10000000000006,
                    "category": {
                      "id": 10000000000001
                    },
                    "categorization": {
                      "displayName": "Location: London"
                    }
                  },
                  {
                    "id": 10000000000043,
                    "category": {
                      "id": 10000000000040
                    },
                    "categorization": {
                      "displayName": "Department: Accounting"
                    }
                  },
                  {
                    "id": 10000000000044,
                    "category": {
                      "id": 10000000000040
                    },
                    "categorization": {
                      "displayName": "Department: Automotive"
                    }
                  },
                  {
                    "id": 10000000000048,
                    "category": {
                      "id": 10000000000040
                    },
                    "categorization": {
                      "displayName": "Department: Financial Services"
                    }
                  },
                  {
                    "id": 10000000000141,
                    "category": {
                      "id": 10000000000136
                    },
                    "categorization": {
                      "displayName": "Service Catalog: hybridclouddemo"
                    }
                  },
                  {
                    "id": 10000000000171,
                    "category": {
                      "id": 10000000000136
                    },
                    "categorization": {
                      "displayName": "Service Catalog: clouddemo"
                    }
                  }
                ],
                "image": "http://localhost:8001/pictures/10r10.png",
                "width": 150,
                "bundle": true,
                "fontFamily": "PatternFlyIcons-webfont",
                "fontContent": "",
                "backgroundColor": "#fff"
              },
              {
                "x": 233,
                "y": 55,
                "id": 10000000000018,
                "name": "RHEL7 on Amazon AWS",
                "tags": [
                  {
                    "id": 10000000000171,
                    "category": {
                      "id": 10000000000136
                    },
                    "categorization": {
                      "displayName": "Service Catalog: clouddemo"
                    }
                  }
                ],
                "image": "http://localhost:8001/pictures/10r14.png",
                "width": 150,
                "backgroundColor": "#fff"
              }
            ],
            "connections": []
          },
          "automate_entrypoints": {
            "Provision": "Service/Provisioning/StateMachines/ServiceProvision_Template/default"
          }
        },
        "created_at": "2016-09-29T18:17:51Z",
        "updated_at": "2016-09-29T18:45:14Z",
        "content": {},
        "actions": [
          {
            "name": "edit",
            "method": "post",
            "href": "http://localhost:8001/api/blueprints/10000000000025"
          },
          {
            "name": "delete",
            "method": "post",
            "href": "http://localhost:8001/api/blueprints/10000000000025"
          },
          {
            "name": "publish",
            "method": "post",
            "href": "http://localhost:8001/api/blueprints/10000000000025"
          },
          {
            "name": "delete",
            "method": "delete",
            "href": "http://localhost:8001/api/blueprints/10000000000025"
          }
        ]
      },
      {
        "href": "http://localhost:8001/api/blueprints/10000000000023",
        "id": 10000000000023,
        "name": "Blueprint One",
        "description": "desc",
        "ui_properties": {
          "num_items": 2,
          "visibility": {
            "id": 900,
            "name": "Public"
          },
          "service_dialog": {
            "id": 10000000000002
          },
          "service_catalog": {
            "id": 10000000000001
          },
          "chart_data_model": {
            "nodes": [
              {
                "x": 73,
                "y": 79,
                "id": 10000000000004,
                "icon": "pf pficon-bundle",
                "name": "Deploy RHEL7 with PostgreSQL",
                "tags": [
                  {
                    "id": 10000000000004,
                    "category": {
                      "id": 10000000000001
                    },
                    "categorization": {
                      "displayName": "Location: New York"
                    }
                  },
                  {
                    "id": 10000000000038,
                    "category": {
                      "id": 10000000000034
                    },
                    "categorization": {
                      "displayName": "Service Level: Gold"
                    }
                  }
                ],
                "image": "http://localhost:8001/pictures/10r4.jpg",
                "width": 150,
                "bundle": true,
                "invalid": false,
                "fontFamily": "PatternFlyIcons-webfont",
                "fontContent": "",
                "action_order": 1,
                "backgroundColor": "#fff"
              },
              {
                "x": 291,
                "y": 86,
                "id": 10000000000018,
                "name": "RHEL7 on Amazon AWS",
                "tags": [
                  {
                    "id": 10000000000171,
                    "category": {
                      "id": 10000000000136
                    },
                    "categorization": {
                      "displayName": "Service Catalog: clouddemo"
                    }
                  },
                  {
                    "id": 10000000000005,
                    "category": {
                      "id": 10000000000001
                    },
                    "categorization": {
                      "displayName": "Location: Chicago"
                    }
                  }
                ],
                "image": "http://localhost:8001/pictures/10r14.png",
                "width": 150,
                "invalid": false,
                "action_order": 0,
                "backgroundColor": "#fff",
                "outputConnectors": []
              }
            ],
            "connections": []
          },
          "automate_entrypoints": {
            "Provision": "Service/Provisioning/StateMachines/ServiceProvision_Template/default",
            "Reconfigure": "/Grandchild 1"
          }
        },
        "created_at": "2016-09-26T17:05:08Z",
        "updated_at": "2016-09-29T18:25:59Z",
        "content": {},
        "actions": [
          {
            "name": "edit",
            "method": "post",
            "href": "http://localhost:8001/api/blueprints/10000000000023"
          },
          {
            "name": "delete",
            "method": "post",
            "href": "http://localhost:8001/api/blueprints/10000000000023"
          },
          {
            "name": "publish",
            "method": "post",
            "href": "http://localhost:8001/api/blueprints/10000000000023"
          },
          {
            "name": "delete",
            "method": "delete",
            "href": "http://localhost:8001/api/blueprints/10000000000023"
          }
        ]
      },
      {
        "href": "http://localhost:8001/api/blueprints/10000000000026",
        "id": 10000000000026,
        "name": "Blueprint Three",
        "description": "The Thirdblueprint",
        "ui_properties": {
          "num_items": 0,
          "visibility": {
            "id": 10000000000001,
            "href": "http://localhost:8001/api/tenants/10000000000001",
            "name": "Red Hat"
          },
          "service_catalog": {
            "id": 10000000000007
          },
          "chart_data_model": {
            "nodes": [],
            "connections": []
          },
          "automate_entrypoints": {
            "Provision": "Service/Provisioning/StateMachines/ServiceProvision_Template/default"
          }
        },
        "created_at": "2016-09-29T18:44:36Z",
        "updated_at": "2016-09-29T18:44:36Z",
        "content": {},
        "actions": [
          {
            "name": "edit",
            "method": "post",
            "href": "http://localhost:8001/api/blueprints/10000000000026"
          },
          {
            "name": "delete",
            "method": "post",
            "href": "http://localhost:8001/api/blueprints/10000000000026"
          },
          {
            "name": "publish",
            "method": "post",
            "href": "http://localhost:8001/api/blueprints/10000000000026"
          },
          {
            "name": "delete",
            "method": "delete",
            "href": "http://localhost:8001/api/blueprints/10000000000026"
          }
        ]
      }
    ];
  }

  function getServiceCatalogs() {
    return [{
      "href": "http://localhost:8001/api/service_catalogs/10000000000001",
      "id": 10000000000001,
      "name": "Amazon Operations",
      "description": "Amazon Operations",
      "tenant_id": 10000000000001,
      "service_templates": {
        "count": 5,
        "resources": [
          {
            "href": "http://localhost:8001/api/service_catalogs/10000000000001/service_templates/10000000000001"
          },
          {
            "href": "http://localhost:8001/api/service_catalogs/10000000000001/service_templates/10000000000002"
          },
          {
            "href": "http://localhost:8001/api/service_catalogs/10000000000001/service_templates/10000000000003"
          },
          {
            "href": "http://localhost:8001/api/service_catalogs/10000000000001/service_templates/10000000000004"
          },
          {
            "href": "http://localhost:8001/api/service_catalogs/10000000000001/service_templates/10000000000018"
          }
        ]
      },
      "actions": [
        {
          "name": "edit",
          "method": "post",
          "href": "http://localhost:8001/api/service_catalogs/10000000000001"
        },
        {
          "name": "delete",
          "method": "post",
          "href": "http://localhost:8001/api/service_catalogs/10000000000001"
        },
        {
          "name": "delete",
          "method": "delete",
          "href": "http://localhost:8001/api/service_catalogs/10000000000001"
        }
      ]
    },
      {
        "href": "http://localhost:8001/api/service_catalogs/10000000000003",
        "id": 10000000000003,
        "name": "Hybrid Cloud Automation Items",
        "description": "Hybrid Cloud Automation Items",
        "tenant_id": 10000000000001,
        "service_templates": {
          "count": 2,
          "resources": [
            {
              "href": "http://localhost:8001/api/service_catalogs/10000000000003/service_templates/10000000000005"
            },
            {
              "href": "http://localhost:8001/api/service_catalogs/10000000000003/service_templates/10000000000006"
            }
          ]
        },
        "actions": [
          {
            "name": "edit",
            "method": "post",
            "href": "http://localhost:8001/api/service_catalogs/10000000000003"
          },
          {
            "name": "delete",
            "method": "post",
            "href": "http://localhost:8001/api/service_catalogs/10000000000003"
          },
          {
            "name": "delete",
            "method": "delete",
            "href": "http://localhost:8001/api/service_catalogs/10000000000003"
          }
        ]
      },
      {
        "href": "http://localhost:8001/api/service_catalogs/10000000000004",
        "id": 10000000000004,
        "name": "Hybrid Cloud Provisioning Items",
        "description": "Hybrid Cloud Provisioning Items",
        "tenant_id": 10000000000001,
        "service_templates": {
          "count": 3,
          "resources": [
            {
              "href": "http://localhost:8001/api/service_catalogs/10000000000004/service_templates/10000000000007"
            },
            {
              "href": "http://localhost:8001/api/service_catalogs/10000000000004/service_templates/10000000000008"
            },
            {
              "href": "http://localhost:8001/api/service_catalogs/10000000000004/service_templates/10000000000009"
            }
          ]
        },
        "actions": [
          {
            "name": "edit",
            "method": "post",
            "href": "http://localhost:8001/api/service_catalogs/10000000000004"
          },
          {
            "name": "delete",
            "method": "post",
            "href": "http://localhost:8001/api/service_catalogs/10000000000004"
          },
          {
            "name": "delete",
            "method": "delete",
            "href": "http://localhost:8001/api/service_catalogs/10000000000004"
          }
        ]
      },
      {
        "href": "http://localhost:8001/api/service_catalogs/10000000000002",
        "id": 10000000000002,
        "name": "Hybrid Cloud Services",
        "description": "Hybrid Cloud Services",
        "tenant_id": 10000000000001,
        "service_templates": {
          "count": 1,
          "resources": [
            {
              "href": "http://localhost:8001/api/service_catalogs/10000000000002/service_templates/10000000000010"
            }
          ]
        },
        "actions": [
          {
            "name": "edit",
            "method": "post",
            "href": "http://localhost:8001/api/service_catalogs/10000000000002"
          },
          {
            "name": "delete",
            "method": "post",
            "href": "http://localhost:8001/api/service_catalogs/10000000000002"
          },
          {
            "name": "delete",
            "method": "delete",
            "href": "http://localhost:8001/api/service_catalogs/10000000000002"
          }
        ]
      },
      {
        "href": "http://localhost:8001/api/service_catalogs/10000000000007",
        "id": 10000000000007,
        "name": "OpenStack Operations",
        "description": "OpenStack Operations",
        "tenant_id": 10000000000001,
        "service_templates": {
          "count": 1,
          "resources": [
            {
              "href": "http://localhost:8001/api/service_catalogs/10000000000007/service_templates/10000000000019"
            }
          ]
        },
        "actions": [
          {
            "name": "edit",
            "method": "post",
            "href": "http://localhost:8001/api/service_catalogs/10000000000007"
          },
          {
            "name": "delete",
            "method": "post",
            "href": "http://localhost:8001/api/service_catalogs/10000000000007"
          },
          {
            "name": "delete",
            "method": "delete",
            "href": "http://localhost:8001/api/service_catalogs/10000000000007"
          }
        ]
      },
      {
        "href": "http://localhost:8001/api/service_catalogs/10000000000006",
        "id": 10000000000006,
        "name": "RHEV Operations",
        "description": "RHEV Operations",
        "tenant_id": 10000000000001,
        "service_templates": {
          "count": 1,
          "resources": [
            {
              "href": "http://localhost:8001/api/service_catalogs/10000000000006/service_templates/10000000000016"
            }
          ]
        },
        "actions": [
          {
            "name": "edit",
            "method": "post",
            "href": "http://localhost:8001/api/service_catalogs/10000000000006"
          },
          {
            "name": "delete",
            "method": "post",
            "href": "http://localhost:8001/api/service_catalogs/10000000000006"
          },
          {
            "name": "delete",
            "method": "delete",
            "href": "http://localhost:8001/api/service_catalogs/10000000000006"
          }
        ]
      },
      {
        "href": "http://localhost:8001/api/service_catalogs/10000000000005",
        "id": 10000000000005,
        "name": "VMware Operations",
        "description": "VMware Operations",
        "tenant_id": 10000000000001,
        "service_templates": {
          "count": 1,
          "resources": [
            {
              "href": "http://localhost:8001/api/service_catalogs/10000000000005/service_templates/10000000000015"
            }
          ]
        },
        "actions": [
          {
            "name": "edit",
            "method": "post",
            "href": "http://localhost:8001/api/service_catalogs/10000000000005"
          },
          {
            "name": "delete",
            "method": "post",
            "href": "http://localhost:8001/api/service_catalogs/10000000000005"
          },
          {
            "name": "delete",
            "method": "delete",
            "href": "http://localhost:8001/api/service_catalogs/10000000000005"
          }
        ]
      }]
  }

  function getTenants() {
    return [{
      "href": "http://localhost:8001/api/tenants/10000000000001",
      "id": 10000000000001,
      "name": "Red Hat"
    }]
  }
});

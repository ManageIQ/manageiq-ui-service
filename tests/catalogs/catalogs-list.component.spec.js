describe('app.components.CatalogsList', function() {
  var $scope;
  var $compile;
  var element;
  var getCatalogsSpy;
  var successResponse = {
    message: 'Success!'
  };

  beforeEach(function () {
    module('app.services', 'app.config', 'app.states', 'app.components', 'gettext');
    bard.inject('CatalogsState', '$state', 'Session', '$httpBackend', '$timeout');
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

    $scope.designerCatalogs = [
      {
        id: '1',
        name: 'Catalog 1',
        description: '1',
        service_templates: {
          resources: [
            {
              href: "http://someurl/api/service_catalogs/1/service_templates/1"
            },
            {
              href: "http://someurl/api/service_catalogs/1/service_templates/11"
            },
          ],
        },
        tenant_id: 1
      },
      {
        id: '2',
        name: 'Catalog 2',
        description: '2',
        service_templates: {
          resources: [
            {
              href: "http://someurl/api/service_catalogs/1/service_templates/2"
            },
            {
              href: "http://someurl/api/service_catalogs/1/service_templates/22"
            },
          ],
        },
        tenant_id: 2
      },
      {
        id: '3',
        name: 'Catalog 3',
        description: '3',
        service_templates: {
          resources: [
            {
              href: "http://someurl/api/service_catalogs/1/service_templates/3"
            },
            {
              href: "http://someurl/api/service_catalogs/1/service_templates/33"
            },
          ],
        },
        tenant_id: 3
      },
    ];

    $scope.serviceTemplates = [
      {
        id: 1,
        name: '1',
        description: 'service template 1',
        picture: {
          id: 1,
          image_href: "http://somehost/pictures/1.png"
        },
        tenant_id: 1
      },
      {
        id: 11,
        name: '11',
        description: 'service template 11',
        picture: {
          id: 11,
          image_href: "http://somehost/pictures/11.png"
        },
        tenant_id: 11
      },
      {
        id: 2,
        name: '2',
        description: 'service template 2',
        picture: {
          id: 2,
          image_href: "http://somehost/pictures/2.png"
        },
        tenant_id: 2
      },
      {
        id: 22,
        name: '22',
        description: 'service template 22',
        picture: {
          id: 22,
          image_href: "http://somehost/pictures/22.png"
        },
        tenant_id: 22
      },
      {
        id: 3,
        name: '3',
        description: 'service template 3',
        picture: {
          id: 3,
          image_href: "http://somehost/pictures/3.png"
        },
        tenant_id: 3
      },
      {
        id: 33,
        name: '33',
        description: 'service template 33',
        picture: {
          id: 33,
          image_href: "http://somehost/pictures/33.png"
        },
        tenant_id: 33
      },
    ];

    $scope.tenants = [
      {
        id: 1,
        name: '1'
      },
      {
        id: 11,
        name: '11'
      },
      {
        id: 2,
        name: '2'
      },
      {
        id: 22,
        name: '22'
      },
      {
        id: 3,
        name: '3'
      },
      {
        id: 33,
        name: '33'
      },
    ];

    $scope.dialogs1 = [
      {
        id: 1,
        label: "1"
      }
    ];

    $scope.dialogs2 = [
      {
        id: 2,
        label: "2"
      }
    ];

    getCatalogsSpy = sinon.stub(CatalogsState, 'getCatalogs').returns(Promise.resolve({resources: $scope.designerCatalogs}));

    var htmlTmp = '' +
      '<catalogs-list designer-catalogs="designerCatalogs"' +
      '               service-templates="serviceTemplates"' +
      '               tenants="tenants"' +
      '               service-dialogs="serviceDialogs">'+
      '</catalogs-list>' +
      '';  

      compileHTML(htmlTmp, $scope);
  });

  describe('catalogsList', function() {
    it('should have correct number of rows', function () {
      var rows = element.find('.designer-catalogs-list .list-group-item');
      expect(rows.length).to.eq($scope.designerCatalogs.length);
    });

    it('should update to the correct number of rows when changed', function () {
      var initLength = $scope.designerCatalogs.length;
      var rows = element.find('.designer-catalogs-list .list-group-item');
      expect(rows.length).to.eq(initLength);

      $scope.designerCatalogs.push(
        {
          id: '4',
          name: 'Catalog 4',
          description: '4',
          service_templates: {
            resources: [
              {
                href: "http://someurl/api/service_catalogs/1/service_templates/4"
              },
              {
                href: "http://someurl/api/service_catalogs/1/service_templates/44"
              },
            ],
          },
          tenant_id: 4
        }
      );
      $scope.$digest();

      rows = element.find('.designer-catalogs-list .list-group-item');
      expect(rows.length).to.eq(initLength + 1);
    });

    it('should expand the row when the toggle is clicked', function () {
      var toggles = element.find('.designer-catalogs-list .list-group-item .list-view-pf-expand .fa.fa-angle-right');
      expect(toggles.length).to.eq(3);
      var expandedRow = element.find('.designer-catalogs-list .list-group-item.list-view-pf-expand-active');
      expect(expandedRow.length).to.eq(0);

      eventFire(angular.element(toggles[0]), 'click');
      $scope.$digest();

      expandedRow = element.find('.designer-catalogs-list .list-group-item.list-view-pf-expand-active');
      expect(expandedRow.length).to.eq(1);

      var serviceTemplateRows = element.find('.designer-catalog-templates-list .list-group-item');
      expect(serviceTemplateRows.length).to.eq(2);
    });
  });
});

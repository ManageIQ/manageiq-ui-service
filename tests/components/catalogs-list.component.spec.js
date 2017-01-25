describe('Component: catalogsList', function() {

  beforeEach(function() {
    module('app.services', 'app.components');
    bard.inject('CatalogsState', '$state', 'Session', '$httpBackend', '$timeout');
  });

  describe('with $compile', function() {
    let scope;
    let element;
    let mockDir = 'tests/mock/catalogs/';
    let getCatalogsSpy;

    beforeEach(inject(function($compile, $rootScope) {
      scope = $rootScope.$new();
      element = angular.element('<catalogs-list designer-catalogs="designerCatalogs" service-templates="serviceTemplates" tenants="tenants"' +
        'service-dialogs="serviceDialogs"/>');
      $compile(element)(scope);

      scope.designerCatalogs = readJSON(mockDir + 'catalogs.json');
      scope.serviceTemplates = readJSON(mockDir + 'service-templates.json');
      scope.tenants = readJSON(mockDir + 'tenants.json');

      Session.create({
        auth_token: 'b10ee568ac7b5d4efbc09a6b62cb99b8',
      });
      $httpBackend.whenGET('').respond(200);

      getCatalogsSpy = sinon.stub(CatalogsState, 'getCatalogs').returns(Promise.resolve({resources: scope.designerCatalogs}));

      scope.$apply();
    }));

    it('should have correct number of rows', function() {
      var rows = element.find('.designer-catalogs-list .list-group-item');
      expect(rows.length).to.eq(scope.designerCatalogs.length);
    });

    it('should update to the correct number of rows when changed', function() {
      var initLength = scope.designerCatalogs.length;
      var rows = element.find('.designer-catalogs-list .list-group-item');
      expect(rows.length).to.eq(initLength);

      scope.designerCatalogs.push(
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
      scope.$apply();

      rows = element.find('.designer-catalogs-list .list-group-item');
      expect(rows.length).to.eq(initLength + 1);
    });

    it('should expand the row when the toggle is clicked', function() {
      var toggles = element.find('.designer-catalogs-list .list-group-item .list-view-pf-expand .fa.fa-angle-right');
      expect(toggles.length).to.eq(3);
      var expandedRow = element.find('.designer-catalogs-list .list-group-item.list-view-pf-expand-active');
      expect(expandedRow.length).to.eq(0);

      eventFire(angular.element(toggles[0]), 'click');
      scope.$apply();

      expandedRow = element.find('.designer-catalogs-list .list-group-item.list-view-pf-expand-active');
      expect(expandedRow.length).to.eq(1);

      var serviceTemplateRows = element.find('.designer-catalog-templates-list .list-group-item');
      expect(serviceTemplateRows.length).to.eq(2);
    });
  });
});

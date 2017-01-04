describe('app.components.CatalogsList', function() {
  let $scope;
  let $compile;
  let $document;
  let element;
  let getCatalogsSpy;
  let successResponse = {
    message: 'Success!'
  };
  let mockDir = 'tests/mock/catalogs/';

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

    $scope.designerCatalogs = readJSON(mockDir + 'catalogs.json');
    $scope.serviceTemplates = readJSON(mockDir + 'service-templates.json');
    $scope.tenants = readJSON(mockDir + 'tenants.json');

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

describe('app.components.CatalogEditor', function() {
  var $scope;
  var $compile;
  var $document;
  var element;
  var getCatalogsSpy;
  var mockDir = 'tests/mock/catalogs/';

  beforeEach(function () {
    module('app.services', 'app.config', 'app.states', 'app.components', 'gettext');
    bard.inject('CatalogsState', '$state', 'Session', '$httpBackend', '$timeout');
  });

  beforeEach(inject(function (_$compile_, _$rootScope_, _$document_) {
    $compile = _$compile_;
    $scope = _$rootScope_;
    $document = _$document_;
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

    $scope.catalog = readJSON(mockDir + 'editCatalog.json');
    $scope.designerCatalogs = readJSON(mockDir + 'catalogs.json');
    $scope.serviceTemplates = readJSON(mockDir + 'service-templates.json');

    getCatalogsSpy = sinon.stub(CatalogsState, 'getCatalogs').returns(Promise.resolve({resources: $scope.designerCatalogs}));

    var htmlTmp = '' +
      '<catalog-editor state-name="designer.catalogs.editor"' +
      '                catalog="catalog"' +
      '                service-templates="serviceTemplates"' +
      '</catalog-editor>' +
      '';

      compileHTML(htmlTmp, $scope);
  });

  describe('catalogEditor', function() {
    it('should set the name and description correctly', function () {
      var nameInput = element.find('#catalog-editor-name');
      expect(nameInput.val()).to.eq($scope.catalog.name);

      var nameInput = element.find('#catalog-editor-description');
      expect(nameInput.val()).to.eq($scope.catalog.description);
    });

    it('should set the dual pane lists correctly', function () {
      var selectedList = element.find('.dual-pane-selector-list.dual-pane-selector-list-right');
      expect(selectedList.length).to.eq(1);

      var selectedItems = angular.element(selectedList).find('.dual-pane-selector-item');
      expect(selectedItems.length).to.eq($scope.catalog.serviceTemplates.length);

      var unassignedList = element.find('.dual-pane-selector-list.dual-pane-selector-list-left');
      expect(unassignedList.length).to.eq(1);

      var unassignedItems = angular.element(unassignedList).find('.dual-pane-selector-item');
      expect(unassignedItems.length).to.eq($scope.serviceTemplates.length - $scope.catalog.serviceTemplates.length);
    });

    it('should recognize add mode and setup correctly', function () {
      $scope.catalog = undefined;
      var htmlTmp = '' +
        '<catalog-editor state-name="designer.catalogs.editor"' +
        '                catalog=""' +
        '                service-templates="serviceTemplates"' +
        '</catalog-editor>' +
        '';

      compileHTML(htmlTmp, $scope);

      var header = element.find('.ss-details-header h2 > span');
      expect(header.length).to.eq(1);
      expect(header[0].innerHTML).to.eq('Add Catalog');

      var nameInput = element.find('#catalog-editor-name');
      expect(nameInput.val()).to.eq('');

      var nameInput = element.find('#catalog-editor-description');
      expect(nameInput.val()).to.eq('');

      var selectedList = element.find('.dual-pane-selector-list.dual-pane-selector-list-right');
      expect(selectedList.length).to.eq(1);

      var selectedItems = angular.element(selectedList).find('.dual-pane-selector-item');
      expect(selectedItems.length).to.eq(0);

      var unassignedList = element.find('.dual-pane-selector-list.dual-pane-selector-list-left');
      expect(unassignedList.length).to.eq(1);

      var unassignedItems = angular.element(unassignedList).find('.dual-pane-selector-item');
      expect(unassignedItems.length).to.eq(4);
    });
  });
});

describe('Component: catalogEditor', function() {

  beforeEach(function() {
    module('app.core', 'app.states');
    bard.inject('CatalogsState', '$state', 'Session', '$httpBackend');
  });

  describe('with $compile', function() {
    let scope;
    let element;
    let getCatalogsSpy;
    let compileHTML;
    let mockDir = 'tests/mock/catalogs/';

    beforeEach(inject(function($compile, $rootScope) {

      compileHTML = function(markup, scope) {
        element = angular.element(markup);
        $compile(element)(scope);

        scope.$apply();
      };

      scope = $rootScope.$new();

      Session.create({
        auth_token: 'b10ee568ac7b5d4efbc09a6b62cb99b8',
      });
      $httpBackend.whenGET('').respond(200);

      scope.catalog = readJSON(mockDir + 'editCatalog.json');
      scope.designerCatalogs = readJSON(mockDir + 'catalogs.json');
      scope.serviceTemplates = readJSON(mockDir + 'service-templates.json');

      getCatalogsSpy = sinon.stub(CatalogsState, 'getCatalogs').returns(Promise.resolve({resources: scope.designerCatalogs}));

      let htmlTmp = '<catalog-editor state-name="designer.catalogs.editor" catalog="catalog" service-templates="serviceTemplates" />';
      compileHTML(htmlTmp, scope);
    }));

    it('should set the name and description correctly', function() {
      let nameInput = element.find('#catalog-editor-name');
      expect(nameInput.val()).to.eq(scope.catalog.name);

      let descriptionInput = element.find('#catalog-editor-description');
      expect(descriptionInput.val()).to.eq(scope.catalog.description);
    });

    it('should set the dual pane lists correctly', function() {
      let selectedList = element.find('.dual-pane-selector-list.dual-pane-selector-list-right');
      expect(selectedList.length).to.eq(1);

      let selectedItems = angular.element(selectedList).find('.dual-pane-selector-item');
      expect(selectedItems.length).to.eq(scope.catalog.serviceTemplates.length);

      let unassignedList = element.find('.dual-pane-selector-list.dual-pane-selector-list-left');
      expect(unassignedList.length).to.eq(1);

      let unassignedItems = angular.element(unassignedList).find('.dual-pane-selector-item');
      expect(unassignedItems.length).to.eq(scope.serviceTemplates.length - scope.catalog.serviceTemplates.length);
    });

    it('should recognize add mode and setup correctly', function() {
      scope.catalog = undefined;
      let htmlTmp = '<catalog-editor state-name="designer.catalogs.editor" catalog="" service-templates="serviceTemplates" />';
      compileHTML(htmlTmp, scope);

      let header = element.find('.ss-details-header h2 ');
      expect(header.length).to.eq(1);
      expect(header[0].innerHTML).to.eq('Add Catalog');

      let nameInput = element.find('#catalog-editor-name');
      expect(nameInput.val()).to.eq('');

      let descriptionInput = element.find('#catalog-editor-description');
      expect(descriptionInput.val()).to.eq('');

      let selectedList = element.find('.dual-pane-selector-list.dual-pane-selector-list-right');
      expect(selectedList.length).to.eq(1);

      let selectedItems = angular.element(selectedList).find('.dual-pane-selector-item');
      expect(selectedItems.length).to.eq(0);

      let unassignedList = element.find('.dual-pane-selector-list.dual-pane-selector-list-left');
      expect(unassignedList.length).to.eq(1);

      let unassignedItems = angular.element(unassignedList).find('.dual-pane-selector-item');
      expect(unassignedItems.length).to.eq(4);
    });
  });
});

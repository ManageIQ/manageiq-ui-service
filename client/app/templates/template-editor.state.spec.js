describe('Component: templateEditor', function() {

  beforeEach(function() {
    module('app.core', 'app.states', 'app.templates');
    bard.inject('TemplatesService', '$state', '$httpBackend');
  });

  describe('with $compile', function() {
    let scope;
    let element;
    let getCatalogsSpy;
    let compileHTML;

    beforeEach(inject(function($compile, $rootScope) {

      compileHTML = function(markup, scope) {
        element = angular.element(markup);
        $compile(element)(scope);

        scope.$apply();
      };

      scope = $rootScope.$new();

      $httpBackend.whenGET('').respond(200);

      scope.template = {};
      let htmlTmp = '<template-editor template=""/>';
      compileHTML(htmlTmp, scope);
    }));

    it("Should have the correct page title", function(){
      let header = element.find('.ss-details-header h2 ');
      expect(header.length).to.eq(1);
      expect(header[0].innerHTML).to.eq('Add Template');
    });

    it('should set the name and description correctly', function() {
      let nameInput = element.find('#template-editor-name');
      expect(nameInput.val()).to.eq('');

       let templateTypes = element.find("select option");
       expect(templateTypes.length).to.eq(5);

       let aceEditor = element.find(".ace-editor");
       expect(aceEditor.length).to.eq(1);
    });


  });
});

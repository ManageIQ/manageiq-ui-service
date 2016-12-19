describe.only('tagEditor', function() {
  var controller;
  var taggingServiceMock;

  beforeEach(module('app.components', 'gettext'));

  beforeEach(inject(function($componentController) {
    taggingServiceMock = {
      getTagCategories: sinon.stub().returns(Promise.resolve()),
    };

    controller = $componentController('tagEditor', {
      taggingService: taggingServiceMock,
    });
  }));

  describe('#$onInit', function() {
    it('begins with an empty list of tagCategories', function() {
      controller.$onInit();
      expect(controller.tagCategories).to.eql([]);
    });

    it('begins with an empty list of assignedTags', function() {
      controller.$onInit();
      expect(controller.assignedTags).to.eql([]);
    });

    it('retrieves tagCategories from taggingService', function(done) {
      var categories = [{ name: 'environment', single_value: true, options: [] }];
      taggingServiceMock.getTagCategories = function() {
        return Promise.resolve(categories);
      }

      controller.$onInit();
      done();

      expect(controller.tagCategories).to.eql(categories);
    });
  });
});

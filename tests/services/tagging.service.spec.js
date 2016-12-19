describe.only('taggingService', function() {
  var service;
  var collectionsApiMock;

  beforeEach(module('app.services', 'app.states', 'app.config', 'gettext'));

  beforeEach(inject(function(taggingService, CollectionsApi) {
    service = taggingService;
    collectionsApiMock = sinon.mock(CollectionsApi);
  }));

  describe('#getTagCategories', function() {
    it('makes a request for categories using the CollectionsApi', function() {
      collectionsApiMock.expects('query');
      service.getTagCategories();
      collectionsApiMock.verify();
    });
  });
});

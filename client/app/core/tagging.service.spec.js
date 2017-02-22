describe('TaggingService', function() {
  var service;
  var collectionsApiMock;

  beforeEach(module('app.states'));

  beforeEach(inject(function(TaggingService, CollectionsApi) {
    service = TaggingService;
    collectionsApiMock = sinon.mock(CollectionsApi);
  }));

  describe('#assignTags', function() {
    it('makes 2 bulk requests (assign, unassign)', function() {
      collectionsApiMock
        .expects('post')
        .withArgs('services', null, {})
        .exactly(2);

      service.assignTags('services', [{}, {}], [{ name: '/first/tag' }], [{ name: '/new/tag' }]);

      collectionsApiMock.verify();
    });
  });

  describe('#findSharedTags', function() {
    it('returns an array of tags common between all selected resources', function() {
      var availableTags = [{name: '/common/tag'}, {name: '/uncommon/tag1'}, {name: '/uncommon/tag2'}]
      var resource1 = { tags: [{name: '/common/tag'}, {name: '/uncommon/tag1'}] };
      var resource2 = { tags: [{name: '/common/tag'}, {name: '/uncommon/tag2'}] };

      var sharedTags = service.findSharedTags([resource1, resource2], availableTags)

      expect(sharedTags.length).to.eql(1);
      expect(sharedTags[0].name).to.eql('/common/tag');
    });
  });

  describe('#parseTag', function() {
    it('converts a tag response into a useable tag object', function() {
      var response = {
        id: 1,
        name: '/tag/name',
        category: { id: 2 },
        categorization: { display_name: 'fancy: name' },
      };

      var expected = {
        id: 1,
        name: '/tag/name',
        category: { id: 2 },
        categorization: { displayName: 'fancy: name' },
      };

      var actual = service.parseTag(response);
      expect(actual).to.be.eql(expected);
    });
  });

  describe('#queryAvailableTags', function() {
    it('makes a request for all tags and filters for valid tags', function() {
      collectionsApiMock
        .expects('query')
        .returns(Promise.resolve());

      service.queryAvailableTags();

      collectionsApiMock.verify();
    });
  });
});

/* global inject */
describe('TaggingService', () => {
  let service, collectionsApiMock

  beforeEach(module('app.states'))

  beforeEach(inject(function (TaggingService, CollectionsApi) {
    service = TaggingService
    collectionsApiMock = sinon.mock(CollectionsApi)
  }))

  describe('#assignTags', () => {
    it('makes 2 bulk requests (assign, unassign)', () => {
      collectionsApiMock
      .expects('post')
      .withArgs('services', null, {})
      .exactly(2)

      service.assignTags('services', [{}, {}], [{name: '/first/tag'}], [{name: '/new/tag'}])

      collectionsApiMock.verify()
    })
  })

  describe('#findSharedTags', () => {
    it('returns an array of tags common between all selected resources', () => {
      const availableTags = [{name: '/common/tag'}, {name: '/uncommon/tag1'}, {name: '/uncommon/tag2'}]
      const resource1 = {tags: [{name: '/common/tag'}, {name: '/uncommon/tag1'}]}
      const resource2 = {tags: [{name: '/common/tag'}, {name: '/uncommon/tag2'}]}

      const sharedTags = service.findSharedTags([resource1, resource2], availableTags)

      expect(sharedTags.length).to.eql(1)
      expect(sharedTags[0].name).to.eql('/common/tag')
    })
  })

  describe('#parseTag', () => {
    it('converts a tag response into a useable tag object', () => {
      const response = {
        id: 1,
        name: '/tag/name',
        category: {id: 2},
        categorization: {display_name: 'fancy: name'}
      }

      const expected = {
        id: 1,
        name: '/tag/name',
        category: {id: 2},
        categorization: {displayName: 'fancy: name'}
      }

      const actual = service.parseTag(response)
      expect(actual).to.be.eql(expected)
    })
  })

  describe('#queryAvailableTags', () => {
    it('makes a request for all tags and filters for valid tags', () => {
      collectionsApiMock
      .expects('query')
      .returns(Promise.resolve())

      service.queryAvailableTags()

      collectionsApiMock.verify()
    })
  })
})

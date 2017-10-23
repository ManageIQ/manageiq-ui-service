/* global CatalogsState, CollectionsApi */
describe('CatalogsState', () => {
  beforeEach(() => {
    module('app.states', 'app.catalogs')
  })

  describe('service', () => {
    let collectionsApiSpy
    const successResponse = {
      message: 'Success'
    }

    beforeEach(() => {
      bard.inject('CatalogsState', 'CollectionsApi', 'EventNotifications')
    })

    it('should query the API for catalogs', () => {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse))
      CatalogsState.getCatalogs()
      expect(collectionsApiSpy).to.have.been.calledWith(
        'service_catalogs',
        {
          expand: ['resources']
        }
      )
    })
    it('should support sorting', () => {
      CatalogsState.setSort('name', true)
      const sort = CatalogsState.getSort()
      const expectedSort = {
        isAscending: true,
        currentField: 'name'
      }
      expect(sort).to.eql(expectedSort)
    })
    it('should support setting filters', () => {
      const filters = [
        {'id': 'name', 'value': 'test'}
      ]
      CatalogsState.setFilters(filters)
      const filterCount = CatalogsState.getFilters()
      expect(filterCount.length).to.eql(1)
    })
    it('should be able query service templates', () => {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse))
      /*  const filters =[
         {'id':'name', 'value':'test'}
       ];
       CatalogsState.setFilters(filters); */
      CatalogsState.getServiceTemplates(5, 0)
      expect(collectionsApiSpy).to.have.been.calledWith(
        'service_templates',
        {
          expand: ['resources'],
          attributes: ['picture', 'picture.image_href', 'service_template_catalog'],
          limit: 5,
          offset: 0,
          filter: ['display=true'],
          sort_by: 'name',
          sort_order: 'asc',
          sort_options: 'ignore_case'
        }
      )
    })
    it('should be able to get permissions', () => {
      const permissions = CatalogsState.getPermissions()
      const expectedPermissions = {
        create: false,
        edit: false,
        delete: false
      }
      expect(permissions).to.eql(expectedPermissions)
    })

    it('should be able to get record Counts ', () => {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse))
      CatalogsState.getMinimal('service_templates')
      expect(collectionsApiSpy).to.have.been.calledWith(
        'service_templates',
        {filter: ['display=true'], hide: 'resources'}
      )
    })
    it('should be able to handle multiple filters for service template querying', () => {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse))
      const filters = [
        {'id': 'name', 'value': 'test'},
        {'id': 'description', 'value': 'test'},
        {'id': 'service_template_catalog.name', 'value': 'test'}
      ]
      CatalogsState.setFilters(filters)
      CatalogsState.getServiceTemplates(5, 0)

      expect(collectionsApiSpy).to.have.been.calledWith(
        'service_templates',
        {
          expand: ['resources'],
          attributes: ['picture', 'picture.image_href', 'service_template_catalog'],
          limit: 5,
          offset: 0,
          filter: ['display=true', 'name=\'%test%\'', 'description=\'%test%\'', 'service_template_catalog.name=test'],
          sort_by: 'name',
          sort_order: 'asc',
          sort_options: 'ignore_case'
        }
      )
    })
  })
})

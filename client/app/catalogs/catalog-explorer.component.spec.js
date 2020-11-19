/* global CatalogsState, $componentController, EventNotifications */
/* eslint-disable no-unused-expressions */
describe('Catalog explorer component - ', () => {
  let scope, ctrl

  beforeEach(() => {
    module('app.core', 'app.states', 'app.catalogs')
    bard.inject('$componentController', 'EventNotifications', 'ListView', 'CatalogsState', '$state')
    ctrl = $componentController('catalogExplorer', {$scope: scope}, {})
  })

  it('is defined', () => {
    expect(ctrl).to.exist
  })
  it('should set permissions', () => {
    const permissions = ctrl.permissions
    const expectedPermissions = {create: false, edit: false, delete: false}
    expect(expectedPermissions).to.eql(permissions)
  })
  it('should init and call getTemplates', (done) => {
    const catalogSpy = sinon.stub(CatalogsState, 'getServiceTemplates').returns(Promise.resolve({'status': 'success'}))
    ctrl.$onInit()
    done()
    expect(catalogSpy).to.have.been.calledWith(20, 0)
  })
  it('should allow pagination to be updated', () => {
    ctrl.$onInit()
    const limit = 40
    const offset = 10
    ctrl.updatePagination(limit, offset)
    expect(ctrl.limit).to.eq(limit)
    expect(ctrl.offset).to.eq(offset)
  })
  it('should allow a toolbar to be configured', () => {
    ctrl.$onInit()
    expect(ctrl.toolbarConfig.sortConfig.fields).to.have.lengthOf(2)
    expect(ctrl.toolbarConfig.sortConfig.currentField).to.eql({'id': 'name', 'title': 'Name', 'sortType': 'alpha'})
  })
  it('should handle REST catalog request failure', (done) => {
    sinon.stub(CatalogsState, 'getServiceTemplates').returns(Promise.reject(new Error({'status': 'failed'})))
    const notificationSpy = sinon.spy(EventNotifications, 'error')
    ctrl.$onInit()
    ctrl.resolveServiceTemplates(10, 0).then((data) => {
      done()
      expect(notificationSpy).to.have.been.calledWith('There was an error loading catalogs.')
    })
  })
  it('should allow for sorting to be able to be updated', () => {
    const catalogSpy = sinon.spy(CatalogsState, 'setSort')
    ctrl.$onInit()
    ctrl.toolbarConfig.sortConfig.onSortChange('name', true)
    expect(catalogSpy).to.have.been.called
  })
})

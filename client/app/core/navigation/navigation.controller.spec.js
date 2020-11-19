/* global Navigation, Session, CollectionsApi, inject, API_BASE, ShoppingCart, $rootScope, $uibModal, $state, $document, EventNotifications, ApplianceInfo, RBAC */
/* eslint-disable no-unused-expressions */
describe('Controller: Navigation', () => {
  beforeEach(module('app.components'))
  let ctrl

  beforeEach(inject(function ($controller) {
    bard.inject('Text', 'Navigation', 'Session', 'ShoppingCart', 'API_BASE', '$rootScope', '$uibModal', '$state',
      '$document', 'EventNotifications', 'ApplianceInfo', 'CollectionsApi', 'RBAC')

    ctrl = $controller('NavigationController', {
      Text: Text,
      Navigation: Navigation,
      Session: Session,
      API_BASE: API_BASE,
      ShoppingCart: ShoppingCart,
      $scope: $rootScope,
      $uibModal: $uibModal,
      $state: $state,
      $document: $document,
      EventNotifications: EventNotifications,
      ApplianceInfo: ApplianceInfo,
      RBAC: RBAC
    })
  }))

  it('is defined', () => {
    expect(ctrl).to.exist
  })

  it('controller sites are defined and injected URL to be correct', () => {
    expect(ctrl.sites).to.exist
    expect(ctrl.sites.length).to.equal(1)
    expect(ctrl.sites[0].url).to.equal('http://localhost:9876')
  })

  it('it contains about information ', () => {
    expect(Object.keys(ctrl.about).length).to.eq(9)
  })

  it('it sets a users group when successfully switched', (done) => {
    const newGroup = {
      description: 'Tenant My Company access',
      href: 'http://localhost:3001/api/groups/10000000000001',
      id: '10000000000001'
    }
    const spy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve())
    ctrl.user().user_href = newGroup.href
    ctrl.switchGroup(newGroup)
    done()

    expect(spy).to.have.been.calledWith('users', '10000000000001', {}, {
      action: 'edit',
      current_group: {id: '10000000000001'}
    })
    expect(ctrl.user().group).to.exist
  })
})

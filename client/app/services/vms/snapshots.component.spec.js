/* global $componentController, EventNotifications, VmsService, CollectionsApi */
/* eslint-disable no-unused-expressions */
describe('Component: snapshots with $componentController', () => {
  let ctrl, notificationsSpy, collectionsApiSpy
  const successResponse = {
    message: 'Success'
  }
  const errorObject = {
    data: {
      error: {
        message: 'failure'
      }
    }
  }

  beforeEach(() => {
    module('app.services')
    bard.inject('VmsService', '$componentController', 'EventNotifications', 'CollectionsApi')
    ctrl = $componentController('vmSnapshots', null, {vmId: '1'})
    ctrl.$onInit()
  }
  )

  it('is defined, accepts bindings', () => {
    expect(ctrl).to.exist
    expect(ctrl.vmId).to.equal('1')
  })

  it('sets correct title', () => {
    expect(ctrl.title).to.equal('Snapshots')
  })

  it('has an onInit()', () => {
    expect(ctrl.$onInit).to.exist
  })

  it('has a deleteSnapshots()', () => {
    ctrl.deleteSnapshots()
    ctrl.deleteSnapshots('action', {item: 'item'})
    expect(ctrl.deleteSnapshots()).to.exist
  })

  it('can succesfully delete snapshots', (done) => {
    notificationsSpy = sinon.spy(EventNotifications, 'batch')
    collectionsApiSpy = sinon.stub(VmsService, 'deleteSnapshots').returns(Promise.resolve({results: ['test', 'test2']}))
    ctrl.deleteSnapshots().then((data) => {
      done()

      expect(notificationsSpy).to.have.been.called
    })
  })

  it('can handle failing to delete snapshots', (done) => {
    notificationsSpy = sinon.spy(EventNotifications, 'error')

    collectionsApiSpy = sinon.stub(VmsService, 'deleteSnapshots').returns(Promise.reject(errorObject))
    ctrl.deleteSnapshots().then((data) => {
      done()
      expect(notificationsSpy).to.have.been.called
    })
  })

  it('can handle deleting a single snapshot', () => {
    ctrl.deleteSnapshot('', {href: '/test', name: 'test'})
    expect(ctrl.snapshotsToRemove).to.deep.eq([{href: '/test'}])
  })

  it('can handle deleting all snapshots', () => {
    ctrl.deleteSnapshot(null)
    expect(ctrl.deleteTitle).to.eq('Delete All Snapshots on VM undefined')
  })

  it('can handle reverting a snapshot successfully', (done) => {
    notificationsSpy = sinon.spy(EventNotifications, 'batch')
    sinon.stub(VmsService, 'revertSnapshot').returns(Promise.resolve('test'))
    ctrl.revertSnapshot('', 1).then((data) => {
      done()

      expect(notificationsSpy).to.have.been.called
    })
  })

  it('can try to revert a snapshot and fail', (done) => {
    notificationsSpy = sinon.spy(EventNotifications, 'error')
    sinon.stub(VmsService, 'revertSnapshot').returns(Promise.reject(errorObject))
    ctrl.revertSnapshot('', 1).then((data) => {
      done()

      expect(notificationsSpy).to.have.been.calledWith('failure')
    })
  })

  it('has a cancelDelete()', () => {
    expect(ctrl.cancelDelete()).to.exist
  })

  it('can resolve getting a VM', (done) => {
    const vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve({results: ['test', 'test2']}))
    ctrl.resolveVm().then((data) => {
      done()

      expect(vmSpy).to.have.been.calledWith('1')
    })
  })

  it('can handle failing to resolve a VM', (done) => {
    sinon.stub(VmsService, 'getVm').returns(Promise.reject(new Error({})))
    notificationsSpy = sinon.spy(EventNotifications, 'error')
    ctrl.resolveVm().then((data) => {
      done()

      expect(notificationsSpy).to.have.been.calledWith('There was an error loading the vm.')
    })
  })

  it('should query the API to resolve snapshots', (done) => {
    collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse))
    ctrl.resolveSnapshots()
    done()

    expect(collectionsApiSpy).to.have.been.called
  })

  it('should show a failure if the API cant resolve snapshots', (done) => {
    collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.reject(successResponse))
    ctrl.resolveSnapshots()
    done()

    expect(collectionsApiSpy).to.have.been.called
  })

  it('should call CollectionsApi post to delete snapshots', (done) => {
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse))
    ctrl.deleteSnapshots()
    done()

    expect(collectionsApiSpy).to.have.been.called
  })
})

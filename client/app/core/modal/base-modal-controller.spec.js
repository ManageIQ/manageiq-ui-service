/* global inject */
/* eslint-disable no-unused-expressions */
describe('BaseModalController', () => {
  beforeEach(module('app.components'))

  let base, controller, CollectionsApi
  const mockModalInstance = {close: angular.noop, dismiss: angular.noop}

  beforeEach(inject(($controller, $injector) => {
    CollectionsApi = $injector.get('CollectionsApi')

    base = $controller('BaseModalController', {
      $uibModalInstance: mockModalInstance
    })

    controller = angular.extend(angular.copy(base), base)
    controller.modalData = {
      id: '1',
      name: 'bar',
      description: 'Your Service'
    }
  }))

  it('delegates dismiss to the local $uibModalInstance when cancel called', () => {
    const spy = sinon.spy(mockModalInstance, 'dismiss')
    controller.cancel()

    expect(spy).to.have.been.called
  })

  it('resets the modal data to the original data emitted by the reset', () => {
    const payload = {original: {name: 'foo', description: 'My Service'}}
    controller.reset(payload)

    expect(controller.modalData.name).to.equal('foo')
    expect(controller.modalData.description).to.equal('My Service')
  })

  it('makes a POST request when save is triggered', (done) => {
    const spy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve())
    const payload = {action: 'edit', resource: controller.modalData}
    controller.action = 'edit'
    controller.collection = 'services'
    controller.save()
    done()

    expect(spy).to.have.been.calledWith('services', '1', {}, payload)
  })
})

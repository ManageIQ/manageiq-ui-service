/* global inject */
/* eslint-disable no-unused-expressions */
describe('Component: actionButtonGroup', () => {
  beforeEach(module('app.components'))

  describe('controller', () => {
    let controller
    const mockData = {name: 'foo', description: 'My service'}
    const mockCancel = angular.noop
    const mockReset = angular.noop
    const mockSave = angular.noop

    beforeEach(inject(($componentController) => {
      controller = $componentController('actionButtonGroup', {}, {
        data: mockData,
        onCancel: mockCancel,
        onReset: mockReset,
        onSave: mockSave
      })
    }))

    it('holds a copy of the original data', () => {
      controller.$onInit()

      expect(controller.original.name).to.equal('foo')
      expect(controller.original.description).to.equal('My service')
    })

    it('calls onCancel when cancelAction is called', () => {
      controller.$onInit()

      const spy = sinon.spy(controller, 'onCancel')

      controller.cancelAction()

      expect(spy).to.have.been.called
    })

    it('calls onReset when emitOriginal is called', () => {
      const payload = {$event: {original: mockData}}
      const spy = sinon.stub(controller, 'onReset')

      controller.$onInit()
      controller.emitOriginal()

      expect(spy).to.have.been.calledWith(payload)
    })

    it('calls onSave when saveResource is called', () => {
      controller.$onInit()

      const spy = sinon.spy(controller, 'onSave')

      controller.saveResource()

      expect(spy).to.have.been.called
    })

    it('delegates to angular.equals when checking if pristine', () => {
      const spy = sinon.spy(angular, 'equals')

      controller.$onInit()
      controller.isPristine()

      expect(spy).to.have.been.calledWith(mockData, mockData)
    })
  })
})

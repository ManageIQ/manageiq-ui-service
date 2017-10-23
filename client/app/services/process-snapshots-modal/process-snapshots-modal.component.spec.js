/* global inject */
/* eslint-disable no-unused-expressions */
describe('Component: processSnapshotsModal', () => {
  beforeEach(module('app'))

  describe('with $componentController', () => {
    const bindings = {
      resolve: {
        vm: {id: 10000000001457},
        modalData: {name: 'Snapshot', description: 'A test snapshot', memory: 128}
      }
    }
    let scope, ctrl

    beforeEach(inject(function ($componentController) {
      ctrl = $componentController('processSnapshotsModal', {$scope: scope}, bindings)
      ctrl.$onInit()
    }))

    it('calls save when save is called', () => {
      const spy = sinon.spy(ctrl, 'save')
      ctrl.save()

      expect(spy).to.have.been.called
    })
  })
})

/* global inject, $state */
/* eslint-disable no-unused-expressions */
describe('Component: orderExplorer', () => {
  beforeEach(() => {
    module('app.states', 'app.orders')
  })

  describe('with $componentController', () => {
    let scope
    let ctrl

    beforeEach(inject(function ($componentController) {
      ctrl = $componentController('orderExplorer', {$scope: scope}, {})
      ctrl.$onInit()
    }))

    it('is defined', () => {
      expect(ctrl).to.exist
    })

    it('should work with $state.go', () => {
      bard.inject('$state')

      $state.go('orders')
      expect($state.is('orders.explorer'))
    })

    it('is can report back a request state', () => {
      const item = {
        request_state: 'finished',
        status: 'Ok'
      }
      const status = ctrl.requestStatus(item)
      expect(status).to.eq('finished')
    })
    it('is can report back a failed order status', () => {
      const item = {
        request_state: 'finished',
        status: 'Error'
      }
      const status = ctrl.requestStatus(item)
      expect(status).to.eq('Error')
    })
  })
})

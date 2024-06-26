/* global $state, $controller */
/* eslint-disable no-unused-expressions */
describe('State: orders.details', () => {
  beforeEach(function () {
    module('app.states', 'app.orders', 'app.core')
  })

  let ctrl

  beforeEach(() => {
    bard.inject('$controller', '$state', '$stateParams')

    ctrl = $controller($state.get('orders.details').controller, {
      $stateParams: {
        serviceOrderId: 213
      },
      order: {name: 'test order'},
      serviceTemplate: {name: 'test template'}
    })
  })

  describe('controller', () => {
    it('is created successfully', () => {
      expect(ctrl).to.exist
    })

    it('has an order title', () => {
      expect(ctrl.order.name).to.be.eq('test order')
    })
  })
})

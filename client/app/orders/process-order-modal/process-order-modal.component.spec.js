/* global inject */
/* eslint-disable no-unused-expressions */
describe('Component: processOrderModal', () => {
  beforeEach(() => {
    module('app.core', 'app.orders')
  })

  describe('controller', () => {
    let ctrl, $componentController

    beforeEach(inject((_$componentController_) => {
      var bindings = {resolve: {order: []}}
      $componentController = _$componentController_
      ctrl = $componentController('processOrderModal', null, bindings)
    }))

    it('should be defined', () => {
      expect(ctrl).to.exist
    })
  })
})

/* global $componentController */
/* eslint-disable no-unused-expressions */
describe('Component: customDropdown ', function () {
  let ctrl
  let updateSpy

  beforeEach(function () {
    module('app.core', 'app.shared')
    bard.inject('$componentController')
    ctrl = $componentController('customDropdown', {}, {
      config: {
        'test': 'test'
      },
      items: ['item1', 'item2'],
      onUpdate: function () {},
      menuRight: true
    })
    updateSpy = sinon.stub(ctrl, 'onUpdate').returns(true)
  })

  it('is defined', function () {
    expect(ctrl).to.exist
  })

  it('should handle changes', () => {
    ctrl.$onChanges()
    expect(updateSpy).have.been.calledWith(
      {$changes: ['item1', 'item2'], $config: {test: 'test'}})
  })

  it('should handle actions', () => {
    const options = {
      isDisabled: false,
      actionFn: function () {}
    }
    const actionFnSpy = sinon.stub(options, 'actionFn').returns(true)
    ctrl.$onInit()
    ctrl.handleAction(options)
    expect(actionFnSpy).to.have.been.called
  })
})

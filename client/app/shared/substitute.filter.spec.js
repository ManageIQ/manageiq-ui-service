/* global inject */
/* eslint-disable no-unused-expressions */
describe('Filter: substitute', () => {
  let substituteFilter

  // load the module
  beforeEach(module('app.shared'))

  // load filter function into variable
  beforeEach(inject(function ($filter) {
    substituteFilter = $filter('substitute')
  }))

  it('should exist when invoked', () => {
    expect(substituteFilter).to.exist
  })

  it('should correctly display valid format', () => {
    expect(substituteFilter('Clear All [[heading]]', {heading: 'Notifications'})).to.be.eq('Clear All Notifications')
  })
})

/* global inject */
/* eslint-disable no-unused-expressions */
describe('Filter: elapsedTimeFilter', () => {
  let elapsedTimeFilter

  // load the module
  beforeEach(module('app.shared'))

  // load filter function into variable
  beforeEach(inject(function ($filter) {
    elapsedTimeFilter = $filter('elapsedTime')
  }))

  it('should exist when invoked', () => {
    expect(elapsedTimeFilter).to.exist
  })

  it('should correctly display valid time format', () => {
    expect(elapsedTimeFilter(120000)).to.be.eq('33 hours 20 min 00 sec')
  })

  it('should correctly display invalid time format', () => {
    expect(elapsedTimeFilter()).to.be.eq('00:00:00')
  })
})

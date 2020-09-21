/* global inject */
/* eslint-disable no-unused-expressions */
describe('Filter: format-bytes/format-megaBytes', () => {
  let formatBytesFilter
  let formatmegaBytesFilter

  // load the module
  beforeEach(module('app.shared'))

  // load filter function into variable
  beforeEach(inject(($filter) => {
    formatBytesFilter = $filter('formatBytes')
    formatmegaBytesFilter = $filter('megaBytes')
  }))

  it('should exist when invoked', () => {
    expect(formatBytesFilter).to.exist
    expect(formatmegaBytesFilter).to.exist
  })

  it('should correctly display valid format', () => {
    expect(formatBytesFilter(2048)).to.be.eq('2 kB')
    expect(formatmegaBytesFilter(128)).to.be.eq(134217728)
  })

  it('should correctly display valid format', () => {
    expect(formatBytesFilter(42424242424242)).to.be.eq('38.58 TB')
  })

  it('should display hyphen when NAN', () => {
    expect(formatBytesFilter('foo')).to.be.eq('-')
  })

  it('should correctly display invalid format', () => {
    expect(formatBytesFilter(0)).to.be.eq('0 Bytes')
  })
})

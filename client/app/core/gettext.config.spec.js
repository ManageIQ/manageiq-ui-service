/* global __ */
describe('Gettext helper with string interpolation', () => {
  beforeEach(() => {
    module('app.core')
  })

  it('translates strings without parameters', () => {
    expect(__('Dashboard')).to.eq('Dashboard')
  })

  it('interpolates %s placeholder', () => {
    expect(__('%s was edited.', 'My Service')).to.eq('My Service was edited.')
  })

  it('interpolates %d placeholder', () => {
    expect(__('%d new notifications', 5)).to.eq('5 new notifications')
  })

  it('interpolates multiple placeholders in order', () => {
    expect(__('%s has %d items', 'Cart', 3)).to.eq('Cart has 3 items')
  })
})

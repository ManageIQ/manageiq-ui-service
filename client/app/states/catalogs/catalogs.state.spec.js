/* global $state */
describe('State: catalogs', () => {
  beforeEach(() => {
    module('app.states')
    bard.inject('$state')
  })

  describe('route', () => {
    beforeEach(() => {
      bard.inject('$state')
    })

    it('should work with $state.go', () => {
      $state.go('catalogs')
      expect($state.is('catalogs'))
    })
  })
})

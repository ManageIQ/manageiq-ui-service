/* global $state */
describe('State: dashboard', () => {
  beforeEach(() => {
    module('app.states')
    bard.inject('$state')
  })

  describe('route', () => {
    beforeEach(() => {
      bard.inject('$state')
    })

    it('should work with $state.go', () => {
      $state.go('dashboard')
      expect($state.is('dashboard'))
    })
  })
})

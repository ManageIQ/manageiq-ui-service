/* global $state */
describe('State: error', () => {
  beforeEach(() => {
    module('app.states')
  })

  describe('route', () => {
    beforeEach(() => {
      bard.inject('$state')
    })

    it('should map /error route to http-error View template', () => {
      expect($state.get('error').template).to.match(/four0four/) // error.html topmost classname
    })

    it('should work with $state.go', () => {
      $state.go('error')
      expect($state.is('error'))
    })
  })
})

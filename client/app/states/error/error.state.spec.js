/* global $state,  */
describe('State: error', () => {
  beforeEach(() => {
    module('app.states')
  })

  describe('route', () => {
    const views = {
      error: 'app/states/error/error.html'
    }

    beforeEach(() => {
      bard.inject('$location', '$rootScope', '$state', '$templateCache')
    })

    it('should map /error route to http-error View template', () => {
      expect($state.get('error').templateUrl).to.equal(views.error)
    })

    it('should work with $state.go', () => {
      $state.go('error')
      expect($state.is('error'))
    })
  })
})

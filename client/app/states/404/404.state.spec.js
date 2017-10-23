/* global $state, $location */
/* eslint-disable no-unused-expressions */
describe('State: 404', () => {
  beforeEach(module('app.states'))

  describe('route', () => {
    const views = {
      four0four: 'app/states/404/404.html'
    }

    beforeEach(() => {
      bard.inject('$location', '$rootScope', '$state')
    })

    it('should map /404 route to 404 View template', () => {
      expect($state.get('404').templateUrl).to.equal(views.four0four)
    })

    it('should work with $state.go', () => {
      $state.go('404')
      expect($state.is('404'))
    })

    it('should route /invalid to the otherwise (404) route', (done) => {
      $location.path('/invalid')
      done()
      expect($state.current.templateUrl).to.equal(views.four0four)
    })
  })
})

/* global $state, $location */
describe('State: 404', () => {
  beforeEach(module('app.states'))

  describe('route', () => {
    beforeEach(() => {
      bard.inject('$location', '$state')
    })

    it('should map /404 route to 404 View template', () => {
      expect($state.get('404').template).to.match(/blank-slate-pf/) // 404.html topmost classname
    })

    it('should work with $state.go', () => {
      $state.go('404')
      expect($state.is('404'))
    })
  })
})

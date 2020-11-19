/* global $state, $componentController */
/* eslint-disable no-unused-expressions */
describe('State: services.details', () => {
  beforeEach(() => {
    module('app.states', 'app.services')
    bard.inject('$state')
  })

  describe('route', () => {
    it('should work with $state.go', () => {
      $state.go('services.details')
      expect($state.is('services.details'))
    })
  })

  describe('controller', () => {
    let controller

    beforeEach(() => {
      bard.inject('$componentController')

      controller = $componentController('serviceExplorer', {})
    })

    it('should be created successfully', () => {
      expect(controller).to.exist
    })
  })
})

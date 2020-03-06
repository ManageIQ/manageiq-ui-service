/* global $state, EventNotifications, $controller, Session */
/* eslint-disable no-unused-expressions */
describe('State: login', () => {
  beforeEach(() => {
    module('app.states')
  })

  describe('controller', () => {
    let ctrl
    beforeEach(() => {
      bard.inject('$controller', '$state', '$stateParams', 'Session', '$window', 'API_LOGIN', 'API_PASSWORD', 'EventNotifications')
      sinon.spy(EventNotifications, 'error')
      ctrl = $controller($state.get('login').controller, {})
    })

    describe('controller initialization', () => {
      it('is created successfully', () => {
        expect(ctrl).to.be.defined
      })

      it('sets app brand', () => {
        expect(ctrl.text.brand).to.equal('<strong>ManageIQ</strong> Service UI')
      })

      it('sets session privilegesError', () => {
        ctrl.onSubmit()
        expect(Session.privilegesError).to.be.false
      })
    })
  })
})

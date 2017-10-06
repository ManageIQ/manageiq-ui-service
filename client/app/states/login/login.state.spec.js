describe('State: login', () => {
  let failureNotificationSpy
  beforeEach(() => {
    module('app.states')

  })

  describe('controller', () => {
    let ctrl
    beforeEach(() => {
      bard.inject('$controller', '$state', '$stateParams', 'Session', '$window', 'API_LOGIN', 'API_PASSWORD', 'EventNotifications')
      failureNotificationSpy = sinon.spy(EventNotifications, 'error')
      ctrl = $controller($state.get('login').controller, {})
    })

    describe('controller initialization', () => {
      it('is created successfully', () => {
        expect(ctrl).to.be.defined
      })

      it('sets app brand', () => {
        expect(ctrl.text.brand).to.equal('<strong>ManageIQ</strong> Service UI')
      })

      it('sets session timeoutNotified and privilegesError', () => {
        ctrl.onSubmit()
        expect(Session.timeoutNotified).to.be.false
        expect(Session.privilegesError).to.be.false
      })
    })
  })
})

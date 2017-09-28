describe('State: login', () => {
  beforeEach(() => {
    module('app.states');
  });

  describe('controller', () => {
    let ctrl;

    beforeEach(() => {
      bard.inject('$controller', '$state', '$stateParams', 'Session', '$window', 'API_LOGIN', 'API_PASSWORD');

      ctrl = $controller($state.get('login').controller, {
        Session: {
          privilegesError: true
        }
      });
    });

    describe('controller initialization', () => {
      it('is created successfully', () => {
        expect(ctrl).to.be.defined;
      });

      it('sets app brand', () => {
        expect(ctrl.text.brand).to.equal('<strong>ManageIQ</strong> Service UI');
      });
    });
  });
});

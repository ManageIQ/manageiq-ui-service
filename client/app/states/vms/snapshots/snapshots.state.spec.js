describe('State: vms.snapshots', () => {
  beforeEach(() => {
    module('app.states');
  });

  describe('controller', () => {
    let ctrl;

    beforeEach(() => {
      bard.inject('$controller', '$state', '$stateParams');

      ctrl = $controller($state.get('vms.snapshots').controller, {
        $stateParams: {
          vmId: 123
        }
      });
    });

    describe('controller initialization', () => {
      it('is created successfully', () => {
        expect(ctrl).to.be.defined;
      });

      it('sets stateParams vmId', () => {
        expect(ctrl.vmId).to.equal(123);
      });
    });
  });
});

describe('Component: processSnapshotsModal', function() {
  beforeEach(module('app'));

  describe('with $componentController', function() {
    const bindings = {resolve: {vm: {id: 10000000001457}, modalData: {name: 'Snapshot', description: 'A test snapshot', memory: 128}}};
    let scope, ctrl;

    beforeEach(inject(function($componentController) {
      ctrl = $componentController('processSnapshotsModal', {$scope: scope}, bindings);
      ctrl.$onInit();
    }));

    it('calls save when save is called', function() {
      const spy = sinon.spy(ctrl, 'save');
      ctrl.save();

      expect(spy).to.have.been.called;
    });

  });
});
describe('app.components.process-requests-modal', function() {
  beforeEach(function () {
    module('app.components');
  });

  describe('controller', function () {
    let ctrl;
    let $componentController;

    beforeEach(inject(function(_$componentController_) {

      var bindings = {resolve:{requests:[]}};
      $componentController = _$componentController_;
      ctrl = $componentController('processRequestsModal', null, bindings);
    }));

    it('should be defined', function () {
      expect(ctrl).to.be.defined;
    });
  });
});

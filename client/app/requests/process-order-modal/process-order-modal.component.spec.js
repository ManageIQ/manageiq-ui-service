describe('Component: processOrderModal', function() {
  beforeEach(function () {
    module('app.core', 'app.requests');
  });

  describe('controller', function () {
    let ctrl;
    let $componentController;

    beforeEach(inject(function(_$componentController_) {

      var bindings = {resolve:{order:[]}};
      $componentController = _$componentController_;
      ctrl = $componentController('processOrderModal', null, bindings);
    }));

    it('should be defined', function () {
      expect(ctrl).to.be.defined;
    });
  });
});

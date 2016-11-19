describe('pagination component', function() {
  beforeEach(module('app.components', 'gettext'));

  describe('controller', function() {
    var controller;
    var $componentController;
    var bindings = {limit: 5, count: 11, offset: 0};

    beforeEach(inject(function(_$componentController_) {
      $componentController = _$componentController_;
      ctrl = $componentController('explorerPagination', null, bindings);

    }));

    it('is defined, accepts bindings limit/count/offset', function() {
      expect(ctrl).to.be.defined;
      expect(ctrl.limit).to.equal(5);
      expect(ctrl.count).to.equal(11);
      expect(ctrl.offset).to.equal(0);
    });
  });
});

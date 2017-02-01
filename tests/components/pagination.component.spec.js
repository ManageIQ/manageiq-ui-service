describe('pagination component', function() {
  beforeEach(module('app.components'));

  describe('controller', function() {
    var controller;
    var $componentController;
    var bindings = {limit: 5, count: 11, offset: 0, onUpdate: angular.noop};
    var ctrl;

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

    it('next increments offset by limit', function() {
      ctrl.$onInit();
      ctrl.next();
      expect(ctrl.offset).to.equal(5);
      expect(ctrl.rightBoundary).to.equal(10);
      expect(ctrl.leftBoundary).to.equal(6);
    });

    it('previous decrements offset by limit', function() {
      ctrl.$onInit();
      ctrl.next();
      ctrl.previous();
      expect(ctrl.offset).to.equal(0);
      expect(ctrl.rightBoundary).to.equal(5);
      expect(ctrl.leftBoundary).to.equal(1);
    });
  });
});
describe('Component: timeline', function() {
  beforeEach(module('app.services'));
  describe('controller', function() {
    let element = angular.element('<div></div>'), ctrl;
    const bindings = {
      data: [{name: "test", "data": [{"date": new Date(0), "details": {"event": "test", "object": "test"}}]}],
      options: {width: 900}
    };

    beforeEach(inject(function($componentController) {
      ctrl = $componentController('timeline', {$element: element}, bindings);
    }));

    it('is defined, accepts bindings data/options', function() {
      ctrl.$onInit();

      expect(ctrl).to.be.defined;
      expect(ctrl.data.details).be.defined;
      expect(ctrl.options.width).be.defined;
    });
  });
});

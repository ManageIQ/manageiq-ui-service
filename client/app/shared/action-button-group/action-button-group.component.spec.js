describe('Component: actionButtonGroup', function() {
  beforeEach(module('app.components'));

  describe('controller', function() {
    var controller;
    var mockData = {name: 'foo', description: 'My service'};
    var mockCancel = angular.noop;
    var mockReset = angular.noop;
    var mockSave = angular.noop;

    beforeEach(inject(function($componentController) {
      controller = $componentController('actionButtonGroup', {}, {
        data: mockData,
        onCancel: mockCancel,
        onReset: mockReset,
        onSave: mockSave
      });
    }));

    it('holds a copy of the original data', function() {
      controller.$onInit();

      expect(controller.original.name).to.equal('foo');
      expect(controller.original.description).to.equal('My service');
    });

    it('calls onCancel when cancelAction is called', function() {
      controller.$onInit();

      var spy = sinon.spy(controller, 'onCancel');

      controller.cancelAction();

      expect(spy).to.have.been.called;
    });

    it('calls onReset when emitOriginal is called', function() {
      var payload = {$event: {original: mockData}};
      var spy = sinon.stub(controller, 'onReset');

      controller.$onInit();
      controller.emitOriginal();

      expect(spy).to.have.been.calledWith(payload);
    });

    it('calls onSave when saveResource is called', function() {
      controller.$onInit();

      var spy = sinon.spy(controller, 'onSave');

      controller.saveResource();

      expect(spy).to.have.been.called;
    });

    it('delegates to angular.equals when checking if pristine', function() {
      var spy = sinon.spy(angular, 'equals');

      controller.$onInit();
      controller.isPristine();

      expect(spy).to.have.been.calledWith(mockData, mockData);
    });
  });
});

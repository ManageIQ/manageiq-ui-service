describe('BaseModalController', function() {
  beforeEach(module('app.components'));

  var base;
  var controller;
  var CollectionsApi;
  var EventNotifications;
  var mockModalInstance = { close: angular.noop, dismiss: angular.noop };

  beforeEach(inject(function($controller, $injector) {
    CollectionsApi = $injector.get('CollectionsApi');
    EventNotifications = $injector.get('EventNotifications');

    base = $controller('BaseModalController', {
      $uibModalInstance: mockModalInstance,
    });

    controller = angular.extend(angular.copy(base), base);
    controller.modalData = {
      id: '1',
      name: 'bar',
      description: 'Your Service',
    }
  }));

  it('delegates dismiss to the local $uibModalInstance when cancel called', function() {
    var spy = sinon.spy(mockModalInstance, 'dismiss');

    controller.cancel();

    expect(spy).to.have.been.called;
  });

  it('resets the modal data to the original data emitted by the reset', function() {
    var payload = { original: { name: 'foo', description: 'My Service' }};

    controller.reset(payload);

    expect(controller.modalData.name).to.equal('foo');
    expect(controller.modalData.description).to.equal('My Service');
  });

  it('makes a POST request when save is triggered', function() {
    var spy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve());
    var payload = { action: 'edit', resource: controller.modalData };

    controller.action = 'edit';
    controller.collection = 'services';
    controller.save();

    expect(spy).to.have.been.calledWith('services', '1', {}, payload);
  });
});

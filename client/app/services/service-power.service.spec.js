/* global CollectionsApi, EventNotifications, ServicePower, readJSON */

function fixture(name) {
  return readJSON('tests/mock/service-power/' + name + '.json');
}

function stubResponse(response) {
  return sinon.stub(CollectionsApi, 'post')
    .returns(Promise.resolve(response));
}

function stubError(response) {
  return sinon.stub(CollectionsApi, 'post')
    .returns(Promise.reject(response));
}

describe('ServicePowerFactory', () => {
  const service = fixture('service');

  beforeEach(() => {
    module('app.states', 'app.services');
    bard.inject('CollectionsApi', 'EventNotifications', 'ServicePower');
  });

  describe('can', () => {
    it('Should allow stopped service to start', () => {
      const allow = ServicePower.can.start(service);
      expect(allow).to.eq(true);
    });

    it('Should not allow stopped service to stop', () => {
      const allow = ServicePower.can.stop(service);
      expect(allow).to.eq(false);
    });

    it('Should not allow stopped service to suspend', () => {
      const allow = ServicePower.can.suspend(service);
      expect(allow).to.eq(false);
    });

    it('Should allow stopped service to retire', () => {
      const allow = ServicePower.can.retire(service);
      expect(allow).to.eq(false);
    });

    it('Should allow power state to be retrieved', () => {
      // TODO
      // const powerState = PowerOperations.getPowerState(service);
      // expect(powerState).to.eq('on');
    });
  });

  describe('do.start', () => {
    it('Should start a service', () => {
      const collectionsApiSpy = stubResponse({ message: 'Success' });

      ServicePower.do.start(service);

      expect(collectionsApiSpy).to.have.been.calledWith('services', 10000000002056, {}, {'action': 'start'});
    });

    it('Should notify of service power start success', (done) => {
      const eventNotificationsSpy = sinon.spy(EventNotifications, 'success');
      stubResponse(fixture('service_start'));

      ServicePower.do.start(service).then(function(data) {
        done();
        expect(eventNotificationsSpy).to.have.been.calledWith('niickapp was started. service id:10000000002056 name:\'niickapp\' starting');
      });
    });

    it('Should notify of service power start failure', (done) => {
      const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error');
      stubError(fixture('service_start_failure'));

      ServicePower.do.start(service).then(function(data) {
        done();
        expect(eventNotificationsFailureSpy).to.have.been.calledWith('There was an error starting this service.');
      });
    });
  });

  describe('do.stop', () => {
    it('Should notify of service power stop success', (done) => {
      const eventNotificationsSpy = sinon.spy(EventNotifications, 'success');
      stubResponse(fixture('service_stop'));

      ServicePower.do.stop(service).then(function(data) {
        done();
        expect(eventNotificationsSpy).to.have.been.calledWith('niickapp was stopped. service id:10000000002056 name:\'niickapp\' stopping');
      });
    });

    it('Should notify of service power stop failure', (done) => {
      const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error');
      stubError(fixture('service_stop'));

      ServicePower.do.stop(service).then(function(data) {
        done();
        expect(eventNotificationsFailureSpy).to.have.been.calledWith('There was an error stopping this service.');
      });
    });
  });

  describe('do.suspend', () => {
    it('Should notify of service suspend success', (done) => {
      const eventNotificationsSpy = sinon.spy(EventNotifications, 'success');
      stubResponse(fixture('service_suspend'));

      ServicePower.do.suspend(service).then(function(data) {
        done();
        expect(eventNotificationsSpy).to.have.been.calledWith('niickapp was suspended. service id:10000000002056 name:\'niickapp\' suspending');
      });
    });
  });
});

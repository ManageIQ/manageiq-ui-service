/* global readJSON, EventNotifications, CollectionsApi, VmPower */
/* eslint-disable no-unused-expressions, semi, space-before-function-paren, comma-dangle */

function fixture(name) {
  return readJSON('tests/mock/vm-power/' + name + '.json');
}

function stubResponse(response) {
  return sinon.stub(CollectionsApi, 'post')
    .returns(Promise.resolve(response));
}

function stubError(response) {
  return sinon.stub(CollectionsApi, 'post')
    .returns(Promise.reject(response));
}

describe('VmPowerFactory', () => {
  const vm = fixture('vm');

  beforeEach(() => {
    module('app.states', 'app.services');
    bard.inject('VmPower', 'CollectionsApi', 'EventNotifications', 'sprintf');
  });

  describe('can', () => {
    it('Should allow a VM to start', () => {
      const allowStart = VmPower.can.start(vm);
      expect(allowStart).to.eq(true);
    });

    it('Should allow a VM to stop', () => {
      const allowStart = VmPower.can.stop(vm);
      expect(allowStart).to.eq(false);
    });

    it('Should allow a VM to suspend', () => {
      const allowStart = VmPower.can.suspend(vm);
      expect(allowStart).to.eq(false);
    });

    it('Should allow power state to be retrieved', () => {
      // TODO
      // const powerState = PowerOperations.getPowerState(vm);
      // expect(powerState).to.eq('on');
    });
  });

  describe('do.start', () => {
    it('Should start power for a VM', () => {
      const collectionsApiSpy = stubResponse({ message: 'Success' });

      VmPower.do.start(vm);

      expect(collectionsApiSpy).to.have.been.calledWith('vms', 10000000002056, {}, {'action': 'start'});
    });

    it('Should notify of VM power start success', (done) => {
      const eventNotificationsSpy = sinon.spy(EventNotifications, 'success');
      stubResponse(fixture('vm_start'));

      VmPower.do.start(vm).then(function(data) {
        done();
        expect(eventNotificationsSpy).to.have.been.calledWith('niickapp was started. VM id:10000000002056 name:\'niickapp\' starting');
      });
    });

    it('Should notify of VM power start failure', (done) => {
      const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error');
      stubError(fixture('vm_start_failure'));

      VmPower.do.start(vm).then(function(data) {
        done();
        expect(eventNotificationsFailureSpy).to.have.been.calledWith('There was an error starting this virtual machine.');
      });
    });
  });

  describe('do.stop', () => {
    it('Should notify of VM power stop success', (done) => {
      const eventNotificationsSpy = sinon.spy(EventNotifications, 'success');
      stubResponse(fixture('vm_stop'));

      VmPower.do.stop(vm).then(function(data) {
        done();
        expect(eventNotificationsSpy).to.have.been.calledWith('niickapp was stopped. VM id:10000000002056 name:\'niickapp\' stopping');
      });
    });

    it('Should notify of VM power stop failure', (done) => {
      const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error');
      stubError(fixture('vm_stop'));

      VmPower.do.stop(vm).then(function(data) {
        done();
        expect(eventNotificationsFailureSpy).to.have.been.calledWith('There was an error stopping this virtual machine.');
      });
    });
  });

  describe('do.suspend', () => {
    it('Should notify of VM suspend success', (done) => {
      const eventNotificationsSpy = sinon.spy(EventNotifications, 'success');
      stubResponse(fixture('vm_suspend'));

      VmPower.do.suspend(vm).then(function(data) {
        done();
        expect(eventNotificationsSpy).to.have.been.calledWith('niickapp was suspended. VM id:10000000002056 name:\'niickapp\' suspending');
      });
    });
  });

  describe('do.retire', () => {
    it('Should notify of VM retire success', (done) => {
      const eventNotificationsSpy = sinon.spy(EventNotifications, 'success');
      stubResponse(fixture('vm_retire'));

      VmPower.do.retire(vm).then(function(data) {
        done();
        expect(eventNotificationsSpy).to.have.been.calledWith('niickapp was retired. Successfully retired VM');
      });
    });

    it('Should notify of VM retire failure', (done) => {
      const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error');
      stubError(fixture('vm_retire_failure'));

      VmPower.do.retire(vm).then(function(data) {
        done();
        expect(eventNotificationsFailureSpy).to.have.been.calledWith('There was an error retiring this virtual machine.');
      });
    });
  });
});

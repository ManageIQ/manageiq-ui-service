/* global CollectionsApi, EventNotifications, PowerOperations, readJSON */

function fixture(name) {
  return readJSON('tests/mock/poweroperations/' + name + '.json');
}

function stubResponse(response) {
  return sinon.stub(CollectionsApi, 'post')
    .returns(Promise.resolve(response));
}

function stubError(response) {
  return sinon.stub(CollectionsApi, 'post')
    .returns(Promise.reject(response));
}

describe('PowerOperationsFactory', () => {
  const service = fixture('service');

  beforeEach(() => {
    module('app.states', 'app.services')
    bard.inject('PowerOperations', 'CollectionsApi', 'EventNotifications', 'sprintf')
  })

  it('Should start power for a service', () => {
    const collectionsApiSpy = stubResponse({
      message: 'Success',
    });

    PowerOperations.startService(service)

    expect(collectionsApiSpy).to.have.been.calledWith(
      'services', 10000000000619, {}, {'action': 'start'}
    )
  })

  it('Should notify of service power start success', (done) => {
    const serviceStartResponse = fixture('service_start');
    const collectionsApiSpy = stubResponse(serviceStartResponse)
    const eventNotificationsSpy = sinon.spy(EventNotifications, 'success')

    PowerOperations.startService(service).then(function (data) {
      done()

      expect(eventNotificationsSpy).to.have.been.calledWith('Deploy Ticket Monster on VMware-20170222-115347 was started. Service id:10000000000619 name:\'Deploy Ticket Monster on VMware-20170222-115347\' starting')
    })
  })

  it('Should notify of service power start failure', (done) => {
    const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error')
    const serviceStartResponse = fixture('service_start_failure');
    const collectionsApiSpy = stubError(serviceStartResponse)

    PowerOperations.startService(service).then(function (data) {
      done()

      expect(eventNotificationsFailureSpy).to.have.been.calledWith('There was an error starting this service.')
    })
  })

  it('Should notify of service power stop success', (done) => {
    const serviceStopResponse = fixture('service_stop');
    const collectionsApiSpy = stubResponse(serviceStopResponse)
    const eventNotificationsSpy = sinon.spy(EventNotifications, 'success')

    PowerOperations.stopService(service).then(function (data) {
      done()

      expect(eventNotificationsSpy).to.have.been.calledWith('Deploy Ticket Monster on VMware-20170222-115347 was stopped. Service id:10000000000619 name:\'Deploy Ticket Monster on VMware-20170222-115347\' stopping')
    })
  })

  it('Should notify of service power stop failure', (done) => {
    const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error')
    const serviceStopResponse = fixture('service_stop');
    const collectionsApiSpy = stubError(serviceStopResponse)

    PowerOperations.stopService(service).then(function (data) {
      done()
      expect(eventNotificationsFailureSpy).to.have.been.calledWith('There was an error stopping this service.')
    })
  })

  it('Should notify of service suspend success', (done) => {
    const serviceSuspendResponse = fixture('service_suspend');
    const collectionsApiSpy = stubResponse(serviceSuspendResponse)
    const eventNotificationsSpy = sinon.spy(EventNotifications, 'success')

    PowerOperations.suspendService(service).then(function (data) {
      done()

      expect(eventNotificationsSpy).to.have.been.calledWith('Deploy Ticket Monster on VMware-20170222-115347 was suspended. Service id:10000000000619 name:\'Deploy Ticket Monster on VMware-20170222-115347\' suspended')
    })
  })

  it('Should notify of service suspend failure', (done) => {
    const serviceSuspendResponse = fixture('service_suspend_failure');
    const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error')
    const collectionsApiSpy = stubError(serviceSuspendResponse)

    PowerOperations.suspendService(service).then(function (data) {
      done()
      expect(eventNotificationsFailureSpy).to.have.been.calledWith('There was an error suspending this service.')
    })
  })

  it('Should allow a service to start', () => {
    const allowStart = PowerOperations.allowStartService(service)
    expect(allowStart).to.eql(true)
  })

  it('Should allow a service to stop', () => {
    const allowStart = PowerOperations.allowStopService(service)
    expect(allowStart).to.eql(false)
  })

  it('Should allow a service to suspend', () => {
    const allowStart = PowerOperations.allowSuspendService(service)
    expect(allowStart).to.eql(false)
  })

  it('Should allow multiple VM\'s to report status of being on', () => {
    const testService = {
      'power_states': [
        'on',
        'on'
      ]
    }
    const powerState = PowerOperations.getPowerState(testService)
    expect(powerState).to.eql('on')
  })

  it('Should allow multiple VM\'s to report status of being off', () => {
    const testService = {
      'power_states': [
        'off',
        'off'
      ]
    }
    const powerState = PowerOperations.getPowerState(testService)
    expect(powerState).to.eql('off')
  })

  it('Should allow multiple VM\'s to report status of timeout', () => {
    const testService = {
      'power_states': [
        'timeout',
        'timeout'
      ]
    }
    const powerState = PowerOperations.getPowerState(testService)
    expect(powerState).to.eql('timeout')
  })

  it('Should display power state change in progress', () => {
    const testVm = {
      'power_state': 'on',
      'power_status': 'starting'
    }
    const progressState = PowerOperations.getPowerState(testVm)
    expect(progressState).to.eql('starting')
  })

  it('Should retrieve the power on state', () => {
    const testVm = {
      'power_state': 'on'
    }
    const testPowerState = PowerOperations.getPowerState(testVm)
    expect(testPowerState).to.eq('on')
  })

  it('Should retrieve the power off state', () => {
    const testVm = {
      'power_state': 'off'
    }
    const testPowerState = PowerOperations.getPowerState(testVm)
    expect(testPowerState).to.eq('off')
  })

  it('Should retrieve the power suspend state', () => {
    const testVm = {
      'power_state': 'suspended'
    }
    const testPowerState = PowerOperations.getPowerState(testVm)
    expect(testPowerState).to.eq('suspended')
  })
})

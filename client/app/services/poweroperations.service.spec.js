/* global readJSON, EventNotifications, CollectionsApi, PowerOperations */
/* eslint-disable no-unused-expressions */
describe('Service: PowerOperationsFactory', () => {
  let mockDir = 'tests/mock/poweroperations/'
  const service = readJSON(mockDir + 'service.json')
  const successResponse = {
    message: 'Success'
  }
  let eventNotificationsSpy, collectionsApiSpy

  beforeEach(() => {
    module('app.states', 'app.services')
    bard.inject('PowerOperations', 'CollectionsApi', 'EventNotifications', 'sprintf')
    eventNotificationsSpy = sinon.spy(EventNotifications, 'success')
  })

  it('Should start power for a service', (done) => {
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse))
    PowerOperations.startService(service)

    done()
    expect(collectionsApiSpy).to.have.been.calledWith(
      'services', 10000000000619, {}, {'action': 'start'}
    )
  })
  it('Should notify of service power start success', (done) => {
    const serviceStartResponse = readJSON(mockDir + 'service_start.json')
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(serviceStartResponse))

    PowerOperations.startService(service).then(function (data) {
      done()

      expect(eventNotificationsSpy).to.have.been.calledWith('Deploy Ticket Monster on VMware-20170222-115347 was started. Service id:10000000000619 name:\'Deploy Ticket Monster on VMware-20170222-115347\' starting')
    })
  })
  it('Should notify of service power start failure', (done) => {
    const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error')
    const serviceStartResponse = readJSON(mockDir + 'service_start_failure.json')
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(serviceStartResponse))

    PowerOperations.startService(service).then(function (data) {
      done()

      expect(eventNotificationsFailureSpy).to.have.been.calledWith('There was an error starting this service.')
    })
  })
  it('Should notify of service power stop success', (done) => {
    const serviceStopResponse = readJSON(mockDir + 'service_stop.json')
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(serviceStopResponse))

    PowerOperations.stopService(service).then(function (data) {
      done()

      expect(eventNotificationsSpy).to.have.been.calledWith('Deploy Ticket Monster on VMware-20170222-115347 was stopped. Service id:10000000000619 name:\'Deploy Ticket Monster on VMware-20170222-115347\' stopping')
    })
  })
  it('Should notify of service power stop failure', (done) => {
    const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error')
    const serviceStopResponse = readJSON(mockDir + 'service_stop.json')
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(serviceStopResponse))

    PowerOperations.stopService(service).then(function (data) {
      done()
      expect(eventNotificationsFailureSpy).to.have.been.calledWith('There was an error stopping this service.')
    })
  })
  it('Should notify of service suspend success', (done) => {
    const serviceSuspendResponse = readJSON(mockDir + 'service_suspend.json')
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(serviceSuspendResponse))

    PowerOperations.suspendService(service).then(function (data) {
      done()

      expect(eventNotificationsSpy).to.have.been.calledWith('Deploy Ticket Monster on VMware-20170222-115347 was suspended. Service id:10000000000619 name:\'Deploy Ticket Monster on VMware-20170222-115347\' suspended')
    })
  })
  it('Should notify of service suspend failure', (done) => {
    const serviceSuspendResponse = readJSON(mockDir + 'service_suspend_failure.json')
    const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error')
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(serviceSuspendResponse))

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
    const progressState = PowerOperations.powerOperationInProgressState(testVm)
    expect(progressState).to.eql(true)
  })
  it('Should retrieve the power on state', () => {
    const testVm = {
      'power_state': 'on'
    }
    const testPowerState = PowerOperations.powerOperationOnState(testVm)
    expect(testPowerState).to.eq(true)
  })
  it('Should retrieve the power off state', () => {
    const testVm = {
      'power_state': 'off'
    }
    const testPowerState = PowerOperations.powerOperationOffState(testVm)
    expect(testPowerState).to.eq(true)
  })
  it('Should retrieve the power suspend state', () => {
    const testVm = {
      'power_state': 'suspended'
    }
    const testPowerState = PowerOperations.powerOperationSuspendState(testVm)
    expect(testPowerState).to.eq(true)
  })
  it('Should retrieve the power timeout state', () => {
    const testVm = {
      'power_state': 'timeout'
    }
    const testPowerState = PowerOperations.powerOperationTimeoutState(testVm)
    expect(testPowerState).to.eq(true)
  })
  it('Should retrieve the power on in progress timeout state', () => {
    const testVm = {
      'power_state': 'timeout',
      'power_status': 'starting'
    }
    const testPowerState = PowerOperations.powerOperationStartTimeoutState(testVm)
    expect(testPowerState).to.eq(true)
  })
  it('Should retrieve the power off in progress timeout state', () => {
    const testVm = {
      'power_state': 'timeout',
      'power_status': 'stopping'
    }
    const testPowerState = PowerOperations.powerOperationStopTimeoutState(testVm)
    expect(testPowerState).to.eq(true)
  })
  it('Should retrieve the power suspend in progress timeout state', () => {
    const testVm = {
      'power_state': 'timeout',
      'power_status': 'suspending'
    }
    const testPowerState = PowerOperations.powerOperationSuspendTimeoutState(testVm)
    expect(testPowerState).to.eq(true)
  })
})

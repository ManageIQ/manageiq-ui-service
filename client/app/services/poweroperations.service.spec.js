/* global readJSON, EventNotifications, CollectionsApi, PowerOperations */
/* eslint-disable no-unused-expressions */
describe('Service: PowerOperationsFactory', () => {
  let mockDir = 'tests/mock/poweroperations/'
  const vm = readJSON(mockDir + 'vm.json')
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
  it('Should start power for a VM', (done) => {
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse))
    PowerOperations.startVm(vm)
    done()

    expect(collectionsApiSpy).to.have.been.calledWith(
      'vms', 10000000002056, {}, {'action': 'start'}
    )
  })
  it('Should notify of VM power start success', (done) => {
    const vmStartResponse = readJSON(mockDir + 'vm_start.json')
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(vmStartResponse))

    PowerOperations.startVm(vm).then(function (data) {
      done()
      expect(eventNotificationsSpy).to.have.been.calledWith('niickapp was started. VM id:10000000002056 name:\'niickapp\' starting')
    })
  })
  it('Should notify of VM power start failure', (done) => {
    const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error')
    const vmStartResponse = readJSON(mockDir + 'vm_start_failure.json')
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(vmStartResponse))

    PowerOperations.startVm(vm).then(function (data) {
      done()
      expect(eventNotificationsFailureSpy).to.have.been.calledWith('There was an error starting this virtual machine.')
    })
  })
  it('Should notify of VM power stop success', (done) => {
    const vmStopResponse = readJSON(mockDir + 'vm_stop.json')
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(vmStopResponse))

    PowerOperations.stopVm(vm).then(function (data) {
      done()

      expect(eventNotificationsSpy).to.have.been.calledWith('niickapp was stopped. VM id:10000000002056 name:\'niickapp\' stopping')
    })
  })
  it('Should notify of VM power stop failure', (done) => {
    const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error')
    const vmStopResponse = readJSON(mockDir + 'vm_stop.json')
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(vmStopResponse))

    PowerOperations.stopVm(vm).then(function (data) {
      done()
      expect(eventNotificationsFailureSpy).to.have.been.calledWith('There was an error stopping this virtual machine.')
    })
  })
  it('Should notify of VM suspend success', (done) => {
    const vmSuspendResponse = readJSON(mockDir + 'vm_suspend.json')
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(vmSuspendResponse))

    PowerOperations.suspendVm(vm).then(function (data) {
      done()

      expect(eventNotificationsSpy).to.have.been.calledWith('niickapp was suspended. VM id:10000000002056 name:\'niickapp\' suspending')
    })
  })
  it('Should notify of VM retire success', (done) => {
    const vmRetireResponse = readJSON(mockDir + 'vm_retire.json')
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(vmRetireResponse))

    PowerOperations.retireVM(vm).then(function (data) {
      done()

      expect(eventNotificationsSpy).to.have.been.calledWith('niickapp was retired. Successfully retired VM')
    })
  })
  it('Should notify of VM retire failure', (done) => {
    const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error')
    const vmRetireResponse = readJSON(mockDir + 'vm_retire_failure.json')
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(vmRetireResponse))

    PowerOperations.retireVM(vm).then(function (data) {
      done()

      expect(eventNotificationsFailureSpy).to.have.been.calledWith('There was an error retiring this virtual machine.')
    })
  })
  it('Should allow a VM to start', () => {
    const allowStart = PowerOperations.allowStartVm(vm)
    expect(allowStart).to.eql(true)
  })
  it('Should allow a VM to stop', () => {
    const allowStart = PowerOperations.allowStopVm(vm)
    expect(allowStart).to.eql(false)
  })
  it('Should allow a VM to suspend', () => {
    const allowStart = PowerOperations.allowSuspendVm(vm)
    expect(allowStart).to.eql(false)
  })
  it('Should allow power state to be retrieved', () => {
    const vm = readJSON(mockDir + 'vm.json')
    const powerState = PowerOperations.getPowerState(vm)
    expect(powerState).to.eq('on')
  })
})

/* global readJSON, EventNotifications, inject, VmsService, PowerOperations, $state, lodash, sprintf, Polling, ModalService, VmPower */
/* eslint-disable no-unused-expressions */
describe('Component: Resource Details', () => {
  beforeEach(() => {
    module('app.core', 'app.states', 'app.services')
  })

  let scope, state, vmSpy, vmData, ctrl, vmPermissions
  let mockDir = 'tests/mock/services/'

  describe('with $componentController', () => {
    beforeEach(inject(($stateParams, $rootScope, $componentController) => {
      scope = $rootScope.$new()
      $stateParams.vmId = '12345'
      bard.inject('VmsService', 'PowerOperations', 'sprintf', 'lodash', 'EventNotifications', 'Polling', 'LONG_POLLING_INTERVAL', '$state', 'ModalService', 'VmPower')
      vmData = readJSON(`${mockDir}vm.json`)
      vmPermissions = readJSON(`${mockDir}vmPermissions.json`)
      state = $state
      sinon.stub(VmsService, 'getInstance').returns(Promise.resolve({'status': 'success'}))
      sinon.stub(VmsService, 'getPermissions').returns(vmPermissions)
      ctrl = $componentController('resourceDetails', {
        $scope: scope,
        VmsService: VmsService,
        sprintf: sprintf,
        lodash: lodash,
        EventNotifications: EventNotifications,
        Polling: Polling,
        PowerOperations: PowerOperations,
        $state: state,
        ModalService: ModalService
      })

      ctrl.$onInit()
    }))
    it('should be able perform power operations on a VM', () => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      const powerOnSpy = sinon.spy(VmPower, 'start')
      const powerOffSpy = sinon.spy(VmPower, 'stop')
      const powerSuspendSpy = sinon.spy(VmPower, 'suspend')
      const retireVMSpy = sinon.spy(VmPower, 'retire')

      expect(ctrl.startVm).to.exist
      ctrl.startVm()
      expect(powerOnSpy).to.have.been.calledOnce
      ctrl.stopVm()
      expect(powerOffSpy).to.have.been.calledOnce
      ctrl.suspendVM()
      expect(powerSuspendSpy).to.have.been.calledOnce
      ctrl.retireVM()
      expect(retireVMSpy).to.have.been.calledOnce
    })
    it('should be able to check for custom buttons', (done) => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      ctrl.vmDetails.custom_actions = vmData.custom_actions
      const customButtonCount = ctrl.customButtonCount()
      done()
      expect(customButtonCount).to.eq(3)
    })
    it('should have list actions', (done) => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      const listActions = ctrl.getListActions()
      done()

      expect(listActions).to.have.length(1)
    })
    it('should have snapshot list actions', (done) => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      const listActions = ctrl.getSnapshotListActions()
      done()

      expect(listActions).to.have.length(1)
    })
    it('should allow you to view snapshot page', (done) => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      const stateSpy = sinon.spy($state, 'go')
      ctrl.viewSnapshots()
      done()

      expect(stateSpy).to.have.been.calledWith('vms.snapshots')
    })
    it('should allow a snapshot model to be opened', (done) => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      const modalSpy = sinon.spy(ModalService, 'open')
      ctrl.processSnapshot()
      done()

      expect(modalSpy).to.have.been.calledOnce
    })
    it('should stop polling when you leave the page', (done) => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      const pollingSpy = sinon.spy(Polling, 'stop')
      ctrl.$onDestroy()
      done()

      expect(pollingSpy).to.have.been.calledWith('vmPolling')
    })
    xit('should allow polling to register', (done) => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      const pollingSpy = sinon.spy(Polling, 'start')
      ctrl.$onInit()
      ctrl.$onDestroy()
      done()

      expect(pollingSpy).to.have.been.calledWith('vmPolling')
    })
    it('when polling runs it should query for records', (done) => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      ctrl.$onInit()
      ctrl.pollVM()
      done()

      expect(vmSpy).to.have.been.calledTwice
    })
    it('should allow instance variables to be processed', (done) => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      const instance = {
        'availability_zone': {'name': 'test'},
        'cloud_tenant': 'test',
        'orchestration_stack': 'test',
        'key_pairs': [
          {'name': 'test'},
          {'name': 'test2'}
        ]
      }
      const expectedInstance = {
        'availability_zone': {'name': 'test'},
        'cloud_tenant': 'test',
        'orchestration_stack': 'test',
        'key_pairs': [{'name': 'test'}, {'name': 'test2'}],
        'availabilityZone': 'test',
        'cloudTenant': 'test',
        'orchestrationStack': 'test',
        'keyPairLabels': ['test', 'test2']
      }
      const instanceObject = ctrl.processInstanceVariables(instance)
      done()

      expect(instanceObject).to.eql(expectedInstance)
    })
    it('should handle http request failures', (done) => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.reject(vmData))
      const notificationSpy = sinon.spy(EventNotifications, 'error')
      ctrl.resolveData().then((data) => {
        done()

        expect(notificationSpy).to.have.been.calledWith('There was an error loading the vm details.')
      })
    })
  })
})

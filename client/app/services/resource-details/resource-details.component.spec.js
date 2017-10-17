describe('Component: Resource Details', () => {

  beforeEach(() => {
    module('app.core', 'app.states', 'app.services')
  })

  let scope, state, vmSpy, instanceSpy, vmData, ctrl, vmPermissions
  let mockDir = 'tests/mock/services/'

  describe('with $compile', () => {
    beforeEach(inject(($stateParams, $compile, $rootScope, $componentController) => {
      scope = $rootScope.$new()
      $stateParams.vmId = '12345'
      bard.inject('VmsService', 'ServicesState', 'PowerOperations', 'sprintf', 'lodash', 'EventNotifications',
        'Polling', 'LONG_POLLING_INTERVAL', '$state', 'ModalService')
      vmData = readJSON(`${mockDir}vm.json`)
      vmPermissions = readJSON(`${mockDir}vmPermissions.json`)
      state = $state
      instanceSpy = sinon.stub(VmsService, 'getInstance').returns(Promise.resolve({'status': 'success'}))
      const permissionsSpy = sinon.stub(VmsService, 'getPermissions').returns(vmPermissions)
      ctrl = $componentController('resourceDetails', {
        $scope: scope,
        VmsService: VmsService,
        ServicesState: ServicesState,
        sprintf: sprintf,
        lodash: lodash,
        EventNotifications: EventNotifications,
        Polling: Polling,
        PowerOperations: PowerOperations,
        $state: state,
        ModalService: ModalService
      })

      ctrl.$onInit()
      scope.$digest()
    }))
    it('should be able perform power operations on a VM', () => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      const powerOnSpy = sinon.spy(PowerOperations, 'startVm')
      const powerOffSpy = sinon.spy(PowerOperations, 'stopVm')
      const powerSuspendSpy = sinon.spy(PowerOperations, 'suspendVm')
      const retireVMSpy = sinon.spy(PowerOperations, 'retireVM')

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
    it('should be able to check for custom buttons', () => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      ctrl.vmDetails.custom_actions = vmData.custom_actions
      const hasCustomButtons = ctrl.hasCustomButtons()

      expect(hasCustomButtons).to.be.true
    })
    it('should have list actions', () => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      const listActions = ctrl.getListActions()

      expect(listActions).to.have.length(1)
    })
    it('should have snapshot list actions', () => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      const listActions = ctrl.getSnapshotListActions()

      expect(listActions).to.have.length(1)
    })
    it('should allow you to view snapshot page', () => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      const stateSpy = sinon.spy($state, 'go')
      ctrl.viewSnapshots()

      expect(stateSpy).to.have.been.calledWith('vms.snapshots')
    })
    it('should allow a snapshot model to be opened', () => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      const modalSpy = sinon.spy(ModalService, 'open')
      ctrl.processSnapshot()

      expect(modalSpy).to.have.been.calledOnce
    })
    it('should stop polling when you leave the page', () => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      const pollingSpy = sinon.spy(Polling, 'stop')
      ctrl.$onDestroy()

      expect(pollingSpy).to.have.been.calledWith('vmPolling')
    })
    xit('should allow polling to register', () => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      const pollingSpy = sinon.spy(Polling, 'start')
      ctrl.$onInit()
      ctrl.$onDestroy()

      expect(pollingSpy).to.have.been.calledWith('vmPolling')
    })
    it('when polling runs it should query for records', () => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      ctrl.$onInit()
      ctrl.pollVM()

      expect(vmSpy).to.have.been.calledTwice
    })
    it('should allow instance variables to be processed', () => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve(vmData))
      const instance = {
        'availability_zone': {'name': 'test'},
        'cloud_tenant': 'test',
        'orchestration_stack': 'test',
        'key_pairs': [
          {'name': 'test'},
          {'name': 'test2'},
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

      expect(instanceObject).to.eql(expectedInstance)
    })
    it('should handle http request failures', () => {
      vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.reject(vmData))
      const notificationSpy = sinon.spy(EventNotifications, 'error')
      return ctrl.resolveData().then((data) => {
        expect(notificationSpy).to.have.been.calledWith('There was an error loading the vm details.')
      })
    })
  })
})

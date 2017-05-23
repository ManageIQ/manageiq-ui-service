describe('Component: VM Details', function() {

  beforeEach(function() {
    module('app.core', 'app.states', 'app.services');
  });

    let scope;
    let isoScope;
    let element;
    let mockDir = 'tests/mock/services/';
    let vmSpy;
    let instanceSpy;
    let vmData;
    let controller;
    let servicePermissions;

    describe('with $compile', function() {
        beforeEach(inject(function($stateParams, $compile, $rootScope, $componentController, $httpBackend) {
        scope = $rootScope.$new();
        $stateParams.vmId = '12345';
        bard.inject('VmsService','ServicesState','PowerOperations','sprintf', 'lodash', 'EventNotifications', 'Polling','LONG_POLLING_INTERVAL');
        vmData = readJSON(`${mockDir}vm.json`);
        servicePermissions = readJSON(`${mockDir}servicePermissions.json`);

        vmSpy = sinon.stub(VmsService,'getVm').returns(Promise.resolve(vmData));
        instanceSpy = sinon.stub(VmsService,'getInstance').returns(Promise.resolve({'status':'success'}))
        const permissionsSpy = sinon.stub(ServicesState,'getPermissions').returns(servicePermissions);
        controller = $componentController('vmDetails', {$scope: scope, VmsService: VmsService, ServicesState: ServicesState, sprintf: sprintf, lodash: lodash, EventNotifications: EventNotifications, Polling: Polling, PowerOperations: PowerOperations});

        scope.$apply();
        scope.$digest();
        }));
        it('should be able perform power operations on a VM', () => {
            const powerOnSpy= sinon.spy(PowerOperations,'startVm');
            const powerOffSpy= sinon.spy(PowerOperations,'stopVm');
            const powerSuspendSpy= sinon.spy(PowerOperations,'suspendVm');
            const retireVMSpy = sinon.spy(PowerOperations,'retireVM');
            controller.$onInit();

            scope.$digest();
            scope.$apply();

        expect(controller.startVm).to.exist;
        controller.startVm();
        expect(powerOnSpy).to.have.been.calledOnce;
        controller.stopVm();
        expect(powerOffSpy).to.have.been.calledOnce;
        controller.suspendVM();
        expect(powerSuspendSpy).to.have.been.calledOnce;
        controller.retireVM();
        expect(retireVMSpy).to.have.been.calledOnce;
    });
        it('should be able to check for custom buttons', () => {
            controller.$onInit();
            controller.vmDetails.custom_actions = vmData.custom_actions;
            scope.$digest();
            scope.$apply();

            const hasCustomButtons = controller.hasCustomButtons();
            expect(hasCustomButtons).to.be.true;
        });
        it('should have list actions', () => {
            controller.$onInit();
            scope.$digest();
            const listActions = controller.getListActions()
            expect(listActions).to.have.length(1);
        });
    });
});

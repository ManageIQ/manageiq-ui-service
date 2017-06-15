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
        instanceSpy = sinon.stub(VmsService,'getInstance').returns(Promise.resolve({'status':'success'}))
        const permissionsSpy = sinon.stub(ServicesState,'getPermissions').returns(servicePermissions);
        controller = $componentController('vmDetails', {$scope: scope, VmsService: VmsService, ServicesState: ServicesState, sprintf: sprintf, lodash: lodash, EventNotifications: EventNotifications, Polling: Polling, PowerOperations: PowerOperations});

        scope.$apply();
        scope.$digest();
        }));
        it('should be able perform power operations on a VM', () => {
            vmSpy = sinon.stub(VmsService,'getVm').returns(Promise.resolve(vmData));
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
            vmSpy = sinon.stub(VmsService,'getVm').returns(Promise.resolve(vmData));
            controller.$onInit();
            controller.vmDetails.custom_actions = vmData.custom_actions;
            scope.$digest();
            scope.$apply();

            const hasCustomButtons = controller.hasCustomButtons();
            expect(hasCustomButtons).to.be.true;
        });
        it('should have list actions', () => {
            vmSpy = sinon.stub(VmsService,'getVm').returns(Promise.resolve(vmData));
            controller.$onInit();
            scope.$digest();
            const listActions = controller.getListActions()
            expect(listActions).to.have.length(1);
        });
        it('should warn if the VM is retired', () => {
            const response = vmData;
            response.retired = true;
            vmSpy = sinon.stub(VmsService,'getVm').returns(Promise.resolve(vmData));
            const notificationSpy = sinon.spy(EventNotifications,'warn');
           // EventNotifications
            controller.$onInit();
            scope.$digest();

            return controller.getData().then( (data) => {
                expect(notificationSpy).to.have.been.calledTwice;
            });
        });
        it('should stop polling when you leave the page', ()=>{
            vmSpy = sinon.stub(VmsService,'getVm').returns(Promise.resolve(vmData));
            const pollingSpy = sinon.spy(Polling,'stop');
            controller.$onInit();
            scope.$digest();
            controller.$onDestroy();
            expect(pollingSpy).to.have.been.calledWith('vmPolling');
        })
        it('should allow polling to register', ()=>{
            vmSpy = sinon.stub(VmsService,'getVm').returns(Promise.resolve(vmData));
            const pollingSpy = sinon.spy(Polling,'start');
            controller.$onInit();
            scope.$digest();
            controller.$onDestroy();
            expect(pollingSpy).to.have.been.calledWith('vmPolling');
        });
        it('when polling runs it should query for records', () => {
            vmSpy = sinon.stub(VmsService,'getVm').returns(Promise.resolve(vmData));
            controller.$onInit();
            scope.$digest();
            controller.pollVM();
            expect(vmSpy).to.have.been.calledTwice;
        });
        it('should allow instance variables to be processed', () => {
            vmSpy = sinon.stub(VmsService,'getVm').returns(Promise.resolve(vmData));
            controller.$onInit();
            scope.$digest();
            const instance = {
                'availability_zone': {'name':'test'},
                'cloud_tenant': 'test',
                'orchestration_stack': 'test',
                'key_pairs': [
                    { 'name': 'test' },
                    { 'name': 'test2' },
                ]
            };
            const expectedInstance = {
                'availability_zone': { 'name': 'test' },
                'cloud_tenant': 'test',
                'orchestration_stack': 'test',
                'key_pairs': [{ 'name': 'test' }, { 'name': 'test2' }],
                'availabilityZone': 'test',
                'cloudTenant': 'test',
                'orchestrationStack': 'test',
                'keyPairLabels': ['test', 'test2']
            };
           const instanceObject = controller.processInstanceVariables(instance);
           expect(instanceObject).to.eql(expectedInstance);
        });
        it('should handle http request failures', () =>{
            vmSpy = sinon.stub(VmsService,'getVm').returns(Promise.reject(vmData));
            const notificationSpy = sinon.spy(EventNotifications,'error');
            controller.$onInit();
            scope.$digest();

            return controller.getData().then( (data) => {
                expect(notificationSpy).to.have.been.calledWith('There was an error loading the vm details.');
            });
        });
    });
});

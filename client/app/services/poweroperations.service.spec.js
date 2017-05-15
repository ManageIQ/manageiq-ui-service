describe('Power Operation Service', function() {
    let mockDir = 'tests/mock/poweroperations/';
    const vm = readJSON(mockDir + 'vm.json');
    const service = readJSON(mockDir + 'service.json');
    const successResponse = {
      message: "Success"
    };
    let eventNotificationsSpy;
    let collectionsApiSpy;

  beforeEach(function() {
    module('app.states', 'app.services');
    bard.inject('PowerOperations', 'CollectionsApi', 'EventNotifications','sprintf');
     eventNotificationsSpy = sinon.spy(EventNotifications, 'success');
  });

  it('Should start power for a service',function(){
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
    PowerOperations.startService(service);

     expect(collectionsApiSpy).to.have.been.calledWith(
          'services',10000000000619, {}, {'action': 'start'}
     );
  });
  it('Should notify of service power start success',function(){
    const serviceStartResponse = readJSON(mockDir + 'service_start.json');
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(serviceStartResponse));
    
    return PowerOperations.startService(service).then(function(data){
      expect(eventNotificationsSpy).to.have.been.calledWith("Deploy Ticket Monster on VMware-20170222-115347 was started. Service id:10000000000619 name:'Deploy Ticket Monster on VMware-20170222-115347' starting");
    });
  });
  it('Should notify of service power start failure',function(){
    const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error');
    const serviceStartResponse = readJSON(mockDir + 'service_start_failure.json');
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(serviceStartResponse));
    
    return PowerOperations.startService(service).then(function(data){
      expect(eventNotificationsFailureSpy).to.have.been.calledWith("There was an error starting this service.");
    });
  });
  it('Should notify of service power stop success',function(){
    const serviceStopResponse = readJSON(mockDir + 'service_stop.json');
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(serviceStopResponse));
    
    return PowerOperations.stopService(service).then(function(data){
      expect(eventNotificationsSpy).to.have.been.calledWith("Deploy Ticket Monster on VMware-20170222-115347 was stopped. Service id:10000000000619 name:'Deploy Ticket Monster on VMware-20170222-115347' stopping");
    });
  });
  it('Should notify of service power stop failure',function(){
    const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error');
    const serviceStopResponse = readJSON(mockDir + 'service_stop.json');
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(serviceStopResponse));
    
    return PowerOperations.stopService(service).then(function(data){
      expect(eventNotificationsFailureSpy).to.have.been.calledWith("There was an error stopping this service.");
    });
  });
  it('Should notify of service suspend success', function(){
        const serviceSuspendResponse = readJSON(mockDir + 'service_suspend.json');
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(serviceSuspendResponse));
    
    return PowerOperations.suspendService(service).then(function(data){
      expect(eventNotificationsSpy).to.have.been.calledWith("Deploy Ticket Monster on VMware-20170222-115347 was suspended. Service id:10000000000619 name:'Deploy Ticket Monster on VMware-20170222-115347' suspended");
    });
  });
  it('Should allow a service to start', ()=>{
    const allowStart = PowerOperations.allowStartService(service);
    expect(allowStart).to.eql(true);
  });
  it('Should allow a service to stop', ()=>{
    const allowStart = PowerOperations.allowStopService(service);
    expect(allowStart).to.eql(false);
  });
  it('Should allow a service to suspend', ()=>{
    const allowStart = PowerOperations.allowSuspendService(service);
    expect(allowStart).to.eql(false);
  });

  it('Should start power for a VM',function(){
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
    PowerOperations.startVm(vm);
    expect(collectionsApiSpy).to.have.been.calledWith(
          'vms',10000000002056, {}, {'action': 'start'}
    );
  });
  it('Should notify of VM power start success',function(){
    const vmStartResponse = readJSON(mockDir + 'vm_start.json');
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(vmStartResponse));
    
    return PowerOperations.startVm(vm).then(function(data){
      expect(eventNotificationsSpy).to.have.been.calledWith("niickapp was started. VM id:10000000002056 name:'niickapp' starting");
    });
  });
  it('Should notify of VM power start failure',function(){
    const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error');
    const vmStartResponse = readJSON(mockDir + 'vm_start_failure.json');
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(vmStartResponse));
    
    return PowerOperations.startVm(vm).then(function(data){
      expect(eventNotificationsFailureSpy).to.have.been.calledWith("There was an error starting this virtual machine.");
    });
  });
  it('Should notify of VM power stop success',function(){
    const vmStopResponse = readJSON(mockDir + 'vm_stop.json');
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(vmStopResponse));
    
    return PowerOperations.stopVm(vm).then(function(data){
      expect(eventNotificationsSpy).to.have.been.calledWith("niickapp was stopped. VM id:10000000002056 name:'niickapp' stopping");
    });
  });
  it('Should notify of VM power stop failure',function(){
    const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error');
    const vmStopResponse = readJSON(mockDir + 'vm_stop.json');
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(vmStopResponse));
    
    return PowerOperations.stopVm(vm).then(function(data){
      expect(eventNotificationsFailureSpy).to.have.been.calledWith("There was an error stopping this virtual machine.");
    });
  });
  it('Should notify of VM suspend success', function(){
    const vmSuspendResponse = readJSON(mockDir + 'vm_suspend.json');
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(vmSuspendResponse));
  
    return PowerOperations.suspendVm(vm).then(function(data){
      expect(eventNotificationsSpy).to.have.been.calledWith("niickapp was suspended. VM id:10000000002056 name:'niickapp' suspending");
    });
  });
  it('Should notify of VM retire success', function(){
    const vmRetireResponse = readJSON(mockDir + 'vm_retire.json');
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(vmRetireResponse));
  
    return PowerOperations.retireVM(vm).then(function(data){
      expect(eventNotificationsSpy).to.have.been.calledWith("niickapp was retired. Successfully retired VM");
    });
  });
  it('Should notify of VM retire failure', function(){
    const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error');
    const vmRetireResponse = readJSON(mockDir + 'vm_retire_failure.json');
    collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(vmRetireResponse));
  
    return PowerOperations.retireVM(vm).then(function(data){
      expect(eventNotificationsFailureSpy).to.have.been.calledWith('There was an error retiring this virtual machine.');
    });
  });
  it('Should allow a VM to start', ()=>{
    const allowStart = PowerOperations.allowStartVm(vm);
    expect(allowStart).to.eql(true);
  });
  it('Should allow a VM to stop', ()=>{
    const allowStart = PowerOperations.allowStopVm(vm);
    expect(allowStart).to.eql(false);
  });
  it('Should allow a VM to suspend', ()=>{
    const allowStart = PowerOperations.allowSuspendVm(vm);
    expect(allowStart).to.eql(false);
  });
  it('Should allow power state to be retrieved', ()=>{
    const vm = readJSON(mockDir + 'vm.json');
    const powerState = PowerOperations.getPowerState(vm);
    expect(powerState).to.eq('on');
  });
});

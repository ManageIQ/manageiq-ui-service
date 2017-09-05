describe('Component: snapshots', function() {
  beforeEach(function() {
    module('app.services');
  });

  describe('with $componentController', function() {
    let $componentController, ctrl, notificationsSpy, collectionsApiSpy;
    let bindings = {vmId: "1"};
    let successResponse = {
      message: "Success"
    };
    let errorResponse = 'error';

    beforeEach(
      inject(function(_$componentController_) {
        $componentController = _$componentController_;
        let transclude = function() {
          let returnObj = {};
          returnObj.length = 0;
          return returnObj
        };
        bard.inject('VmsService');
        ctrl = $componentController('vmSnapshots', {$transclude: transclude}, bindings);
      })
    );

    it('is defined, accepts bindings', function() {
      expect(ctrl).to.be.defined;
      expect(ctrl.vmId).to.equal("1");
    });

    it('sets correct title', function() {
      expect(ctrl.title).to.equal("Snapshots");
    });

    it('has an onInit()', function() {
      expect(ctrl.$onInit).to.be.defined;
    });

    it('has a deleteSnapshots()', function() {
      ctrl.deleteSnapshots()
      ctrl.deleteSnapshots("action", {item: "item"})
      expect(ctrl.deleteSnapshots()).to.be.defined;
    });
    
    it('can succesfully delete snapshots', () => {
      notificationsSpy = sinon.spy(EventNotifications, 'batch');
      collectionsApiSpy = sinon.stub(VmsService, 'deleteSnapshots').returns(Promise.resolve({results: ['test', 'test2']}));
      return ctrl.deleteSnapshots().then((data) => {
          expect(notificationsSpy).to.have.been.called;
      })
    })
    it('can handle failing to delete snapshots', () => {
      notificationsSpy = sinon.spy(EventNotifications, 'error');
      const errorObject = {
          data: {
            error: {
              message: 'failure'
            }
          }
      };

      collectionsApiSpy = sinon.stub(VmsService, 'deleteSnapshots').returns(Promise.reject( errorObject));
      return ctrl.deleteSnapshots().then((data) => {
          expect(notificationsSpy).to.have.been.called;
      })
    });
    it('can handle deleting a single snapshot', () => {
      ctrl.deleteSnapshot('', {href:'/test', name: 'test'});
      expect(ctrl.snapshotsToRemove).to.deep.eq([{ href: '/test' }]);
    });
    it('can handle deleting all snapshots', () => {
      ctrl.deleteSnapshot(null);
      expect(ctrl.deleteTitle).to.eq('Delete All Snapshots on VM undefined');
    });
    it('can handle reverting a snapshot successfully', () => {
      notificationsSpy = sinon.spy(EventNotifications, 'batch');
      const vmAPISpy = sinon.stub(VmsService, 'revertSnapshot').returns(Promise.resolve('test'));
      return ctrl.revertSnapshot('',1).then( (data) => {
        expect(notificationsSpy).to.have.been.calledOnce;
      });
    });
    it('can try to revert a snapshot and fail', () => {
      notificationsSpy = sinon.spy(EventNotifications, 'error');
      const errorObject = {
          data: {
            error: {
              message: 'failure'
            }
          }
      };
      const vmAPISpy = sinon.stub(VmsService, 'revertSnapshot').returns(Promise.reject(errorObject));
      return ctrl.revertSnapshot('',1).then( (data) => {
        expect(notificationsSpy).to.have.been.calledWith('failure');
      });
    });
    it('has a cancelDelete()', function() {
      expect(ctrl.cancelDelete()).to.be.defined;
    });
    it('can resolve getting a VM', () => {
      const vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.resolve({results: ['test', 'test2']}));
      return ctrl.resolveVm().then((data) => {
        expect(vmSpy).to.have.been.calledWith('1');
      })
    });
    it('can handle failing to resolve a VM', () => {
      const vmSpy = sinon.stub(VmsService, 'getVm').returns(Promise.reject({}));
      notificationsSpy = sinon.spy(EventNotifications, 'error');
      return ctrl.resolveVm().then((data) => {
        expect(notificationsSpy).to.have.been.calledWith('There was an error loading the vm.');
      });
    });
    beforeEach(function() {
      bard.inject('CollectionsApi', 'EventNotifications');
      notificationsSpy = sinon.stub(EventNotifications, 'result').returns(null);
      ctrl.$onInit();
    });

    it('should query the API to resolve snapshots', function() {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse));
      ctrl.resolveSnapshots();
      expect(collectionsApiSpy).to.have.been.called;
    });
    it('should show a failure if the API cant resolve snapshots', () => {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.reject(successResponse));
      ctrl.resolveSnapshots();
      expect(collectionsApiSpy).to.have.been.called;
    })
    it('should call CollectionsApi post to delete snapshots', function() {
      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
      ctrl.deleteSnapshots();
      expect(collectionsApiSpy).to.have.been.called;
    });
  });
});

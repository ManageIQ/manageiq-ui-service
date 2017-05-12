describe('Component: snapshots', function () {
    beforeEach(function () {
        module('app.services');
    });

    describe('with $componentController', function () {
        let $componentController, ctrl, notificationsSpy, collectionsApiSpy;
        let bindings = {vmId: "1"};
        let successResponse = {
            message: "Success"
        };
        let errorResponse = 'error';

        beforeEach(
            inject(function (_$componentController_) {
                $componentController = _$componentController_;
                let transclude = function () {
                    let returnObj = {};
                    returnObj.length = 0;
                    return returnObj
                };
                ctrl = $componentController('vmSnapshots', {$transclude: transclude}, bindings);
            })
        );

        it('is defined, accepts bindings', function () {
            expect(ctrl).to.be.defined;
            expect(ctrl.vmId).to.equal("1");
        });

        it('sets correct title', function () {
            expect(ctrl.title).to.equal("Snapshots");
        });

        it('has an onInit()', function () {
            ctrl.$onInit();
            expect(ctrl.$onInit).to.be.defined;
        });

        beforeEach(function () {
            bard.inject('CollectionsApi', 'EventNotifications');
            notificationsSpy = sinon.stub(EventNotifications, 'result').returns(null);
            ctrl.$onInit();
        });

        it('should query the API to resolve snapshots', function () {
            collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse));
            ctrl.resolveSnapshots();
            expect(collectionsApiSpy).to.have.been.called;
        });

        it('should call CollectionsApi post to delete snapshots', function () {
            collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
            ctrl.deleteSnapshots();
            expect(collectionsApiSpy).to.have.been.called;
        });
    });
});

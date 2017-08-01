describe('Component: shoppingCart', function () {
    let scope;
    let ctrl;
    let updateSpy;
    let dismissFn;
    let successNotificationSpy, failureNotificationSpy;
    beforeEach(function () {
        module('app.core');
        bard.inject('$componentController', 'EventNotifications', 'ShoppingCart', '$state');
        
        const modalInstance = {
            dismiss: function(){}
        };
        dismissFn = sinon.stub(modalInstance, 'dismiss').returns(true);
        successNotificationSpy = sinon.spy(EventNotifications, 'success');
        failureNotificationSpy = sinon.spy(EventNotifications, 'error');
        ctrl = $componentController('shoppingCart', {
        }, {modalInstance: modalInstance});
    });

    it('is defined', function () {
        expect(ctrl).to.be.defined;
    });

    it('should handle refreshing state', () => {
        const stateSpy = sinon.stub(ShoppingCart, 'state').returns(true);
        ctrl.$doCheck();
        expect(stateSpy).to.have.been.called.once;
    });

    it('should able to be submitted successfully', () => {
        const submitSpy = sinon.stub(ShoppingCart, 'submit').returns(Promise.resolve({ 'status': 'success' }));
        return ctrl.submit().then(() => {
            expect(submitSpy).to.have.been.called.once;
            expect(dismissFn).to.have.been.called.once;
            expect(successNotificationSpy).to.have.been.calledWith('Shopping cart successfully ordered');
        });
    });

    it('should able to be submitted and fail', () => {
        const submitSpy = sinon.stub(ShoppingCart, 'submit').returns(Promise.reject('failure'));
        return ctrl.submit().then(() => {
            expect(failureNotificationSpy).to.have.been.calledWith('There was an error submitting this request: failure');
        });
    });

    it('should allow a shopping cart modal to be closed', () => {
        ctrl.close();
        expect(dismissFn).to.have.been.called.once;
    });
});

describe('Component: ownershipServiceModal', () => {
    beforeEach(module('app'));

    describe('with $componentController', () => {
        const service = {
            id: 1234,
            evm_owner: {
                userid: 1234
            },
            miq_group: {
                description: 'test'
            }
        };
        const bindings = {
            resolve: {
                services: [service],
                users: [],
                groups: []
            },
            close: function () { },
            dismiss: function () { }
        };
        let scope, ctrl;

        beforeEach(inject(($componentController) => {
            bard.inject('CollectionsApi', 'EventNotifications', 'lodash', '$state');
            ctrl = $componentController('ownershipServiceModal', { $scope: scope }, bindings);
            ctrl.$onInit();
        }));

        it('Saves successfully', () => {
            const response = {
                results: [{ "success": "true", "message": "test" }]
            };
            const spy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(response));
            const notificationSpy = sinon.stub(EventNotifications, 'batch').returns(true);
            return ctrl.save().then((data) => {
                expect(spy).to.have.been.calledWith('services', '');
                expect(notificationSpy).to.have.been.calledWith([{ message: "test", success: "true" }], 'Setting ownership.', 'Error setting ownership.');
            });
        });

        it('Save fails', () => {
            const spy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject({"status": "error"}));
            const notificationSpy = sinon.stub(EventNotifications, 'error').returns(true);
            return ctrl.save().then((data) => {
                expect(notificationSpy).to.have.been.calledWith('There was an error saving ownership.');
            });
        });

        it('supports cancelling a modal', () => {
            const dismissSpy = sinon.spy(ctrl, 'dismiss');
            ctrl.cancel();
            expect(dismissSpy).to.have.been.calledWith({ $value: "cancel" });
        });
    });
});

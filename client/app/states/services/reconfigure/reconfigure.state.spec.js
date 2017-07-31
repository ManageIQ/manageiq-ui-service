describe('State: services.reconfigure', function() {
  beforeEach(function() {
    module('app.states');
  });

  describe('controller', function() {
    let collectionsApiSpy, ctrl, notificationsErrorSpy, notificationsSuccessSpy, autoRefreshSpy, refreshSingleFieldSpy;
    let dialogFields = [{
      name: 'dialogField1',
      default_value: '1'
    }, {
      name: 'dialogField2',
      default_value: '2'
    }];
    let dialog = {
      dialog_tabs: [{
        dialog_groups: [{
          dialog_fields: dialogFields
        }]
      }]
    };

    beforeEach(function() {
      bard.inject('$controller', '$state', '$stateParams', 'CollectionsApi', 'Notifications', 'DialogFieldRefresh', 'AutoRefresh');

      autoRefreshSpy = sinon.stub(AutoRefresh, 'listenForAutoRefresh').callsFake(function() {
        return false;
      });

      refreshSingleFieldSpy = sinon.stub(DialogFieldRefresh, 'refreshSingleDialogField');

      ctrl = $controller($state.get('services.reconfigure').controller, {
        $stateParams: {
          serviceId: 123
        },
        service: {provision_dialog: dialog, id: 123, service_template_catalog_id: 1234}
      });
    });

    describe('controller initialization', function() {
      it('is created successfully', function() {
        expect(ctrl).to.be.defined;
      });

      it('listens for auto refresh messages', function() {
        expect(autoRefreshSpy).to.have.been.calledWith(
          dialogFields, [], 'services/1234/service_templates', 123, refreshSingleFieldSpy
        );
      });
    });

    describe('controller#submitDialog', function() {
      describe('when the API call is successful', function() {
        beforeEach(function() {
          const successResponse = {
            message: 'Great Success!'
          };

          collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
          notificationsSuccessSpy = sinon.spy(Notifications, 'success');
        });

        it('POSTs to the service templates API', function() {
          ctrl.submitDialog();

          expect(collectionsApiSpy).to.have.been.calledWith(
            'services',
            123,
            {},
            '{"action":"reconfigure","resource":{"href":"/api/services/123","dialogField1":"1","dialogField2":"2"}}'
          );
        });

        it('and canceled, does not POST to the service templates API', function() {
          ctrl.cancelDialog();

          expect(collectionsApiSpy).to.have.not.been.calledWith(
            'services',
            123,
            {},
            '{"action":"reconfigure","resource":{"href":"/api/services/123","dialogField1":"1","dialogField2":"2"}}'
          );
        });

        it('makes a notification success call', function(done) {
          ctrl.submitDialog();
          done();

          expect(notificationsSuccessSpy).to.have.been.calledWith('Great Success!');
        });

        it('goes to the service details', function(done) {
          ctrl.submitDialog();
          done();

          expect($state.is('services.details')).to.be.true;
        });
      });

      describe('when the API call fails', function() {
        beforeEach(function() {
          const errorResponse = 'oopsies';

          collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(errorResponse));
          notificationsErrorSpy = sinon.spy(Notifications, 'error');
        });

        it('makes a notification error call', function(done) {
          ctrl.submitDialog();
          done();

          expect(notificationsErrorSpy).to.have.been.calledWith(
            'There was an error submitting this request: oopsies'
          );
        });

        it('goes back to the service details', function(done) {
          ctrl.backToService();
          done();

          expect($state.is('services.details')).to.be.true;
        });

      });
    });
  });
});

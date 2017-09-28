describe('services.custom_button_details', function() {
  beforeEach(function() {
    module('app.states');
  });

  describe('controller', function() {
    var collectionsApiSpy;
    var controller;
    var notificationsErrorSpy;
    var notificationsSuccessSpy;
    var refreshSingleFieldSpy;
    var dialogFields = [{
      name: 'dialogField1',
      default_value: '1'
    }, {
      name: 'dialogField2',
      default_value: '2'
    }];
    var dialog = {
      dialog_tabs: [{
        dialog_groups: [{
          dialog_fields: dialogFields
        }]
      }]
    };
    var button = {
      name: 'buttonName',
      applies_to_id: 456,
      applies_to_class: 'servicetemplate'
    };

    beforeEach(function() {
      bard.inject('$controller', '$log', '$state', '$stateParams', '$rootScope', 'CollectionsApi', 'Notifications', 'DialogFieldRefresh');

      refreshSingleFieldSpy = sinon.stub(DialogFieldRefresh, 'refreshDialogField');

      controller = $controller($state.get('services.custom_button_details').controller, {
        dialog: {content: [dialog], id: 213},
        service: {},
        $stateParams: {
          dialogId: 213,
          button: button,
          serviceId: 123,
          serviceTemplateCatalogId: 321
        }
      });
      const dialogData = {
        "validations": {
          "isValid": true
        },
        "data": {
          "dialogField1": 1,
          "dialogField2": 2
        }
      };
      controller.setDialogData(dialogData);
    });

    describe('controller initialization', function() {
      it('is created successfully', function() {
        expect(controller).to.be.defined;
      });
    });
    describe('dialog values are updated', () => {
      it('has values updated', () => {
        const dialogValues = {
          "dialogField1": 1,
          "dialogField2": 2
        }; 
        expect(controller.dialogData).to.eql(dialogValues);
      });
    });
    describe('controller#submitCustomButton', function() {
      describe('when the API call is successful', function() {
        beforeEach(function() {
          var successResponse = {
            message: 'Great Success!'
          };

          collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
          notificationsSuccessSpy = sinon.spy(Notifications, 'success');
        });

        it('POSTs to the services API', function() {
          controller.submitCustomButton();
          expect(collectionsApiSpy).to.have.been.calledWith(
            'services',
            123,
            {},
            '{"action":"buttonName","resource":{"dialogField1":1,"dialogField2":2}}'
          );
        });

        it('makes a notification success call', function(done) {
          controller.submitCustomButton();
          done();
          expect(notificationsSuccessSpy).to.have.been.calledWith('Great Success!');
        });

        it('goes to the service details', function(done) {
          controller.submitCustomButton();
          done();
          expect($state.is('services.details')).to.be.true;
        });
      });

      describe('when the API call fails', function() {
        beforeEach(function() {
          var errorResponse = 'oopsies';

          collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(errorResponse));
          notificationsErrorSpy = sinon.spy(Notifications, 'error');
        });

        it('makes a notification error call', function(done) {
          controller.submitCustomButton();
          done();
          expect(notificationsErrorSpy).to.have.been.calledWith(
            'There was an error submitting this request: oopsies'
          );
        });
      });
    });
  });
  
  describe('Custom button actions for a VM', () => {
    let collectionsApiSpy;
    let controller;
    let notificationsErrorSpy;
    let notificationsSuccessSpy;
    let refreshSingleFieldSpy;
    const dialogFields = [{
      name: 'dialogField1',
      default_value: '1'
    }, {
      name: 'dialogField2',
      default_value: '2'
    }];
    const dialog = {
      dialog_tabs: [{
        dialog_groups: [{
          dialog_fields: dialogFields
        }]
      }]
    };
    const button = {
      name: 'buttonName',
      applies_to_id: 456,
      applies_to_class: 'vm'
    };

    beforeEach(function () {
      bard.inject('$controller', '$log', '$state', '$stateParams', '$rootScope', 'CollectionsApi', 'Notifications', 'DialogFieldRefresh');

      refreshSingleFieldSpy = sinon.stub(DialogFieldRefresh, 'refreshDialogField');

      controller = $controller($state.get('services.custom_button_details').controller, {
        dialog: { content: [dialog], id: 213 },
        service: {},
        $stateParams: {
          dialogId: 213,
          button: button,
          serviceId: 123,
          vmId: 456,
          serviceTemplateCatalogId: 321
        }
      });
      const dialogData = {
        "validations": {
          "isValid": true
        },
        "data": {
          "dialogField1": 1,
          "dialogField2": 2
        }
      };
      controller.setDialogData(dialogData);
    });
    it('POSTs to the vms API', () => {
      const successResponse = {
        message: 'Great Success!'
      };

      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
      notificationsSuccessSpy = sinon.spy(Notifications, 'success');

      controller.submitCustomButton();
      expect(collectionsApiSpy).to.have.been.calledWith(
        'vms',
        456,
        {},
        '{"action":"buttonName","resource":{"dialogField1":1,"dialogField2":2}}'
      );
    });
    it('goes to the resource details', function(done) {
      controller.submitCustomButton();
      done();
      expect($state.is('services.resource-details')).to.be.true;
    });
  })
});

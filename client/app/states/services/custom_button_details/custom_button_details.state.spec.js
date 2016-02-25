/* jshint -W117, -W030 */
describe('services.custom_button_details', function() {
  beforeEach(function() {
    module('app.states', 'app.config', 'gettext', bard.fakeToastr);
  });

  describe('controller', function() {
    var collectionsApiSpy;
    var controller;
    var notificationsErrorSpy;
    var notificationsSuccessSpy;
    var dialog = {
      dialog_tabs: [{
        dialog_groups: [{
          dialog_fields: [{
            name: 'dialogField1',
            default_value: '1'
          }, {
            name: 'dialogField2',
            default_value: '2'
          }]
        }]
      }]
    };
    var button = {
      name: 'buttonName',
      applies_to_id: 456
    };

    beforeEach(function() {
      bard.inject('$controller', '$log', '$state', '$stateParams', '$rootScope', 'CollectionsApi', 'Notifications');

      controller = $controller($state.get('services.custom_button_details').controller, {
        $stateParams: {
          dialog: dialog,
          button: button,
          serviceId: 123,
          serviceTemplateCatalogId: 321
        }
      });
      $rootScope.$apply();
    });

    describe('controller initialization', function() {
      it('is created successfully', function() {
        expect(controller).to.be.defined;
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
            '{"action":"buttonName","resource":{"dialogField1":"1","dialogField2":"2"}}'
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
});

describe('Catalogs.details', function() {
  beforeEach(function() {
    module('app.states');
  });

  describe('#resolveDialogs', function() {
    var collectionsApiSpy;

    beforeEach(function() {
      bard.inject('$state', '$stateParams', 'CollectionsApi');

      $stateParams.serviceTemplateId = 123;
      collectionsApiSpy = sinon.spy(CollectionsApi, 'query');
    });

    it('should query the API with the correct template id and options', function() {
      var options = {expand: 'resources', attributes: 'content'};
      $state.get('catalogs.details').resolve.dialogs($stateParams, CollectionsApi);
      expect(collectionsApiSpy).to.have.been.calledWith('service_templates/123/service_dialogs', options);
    });
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

    var dialogs = {
      subcount: 1,
      resources: [{
        content: [{
          dialog_tabs: [{
            dialog_groups: [{
              dialog_fields: dialogFields
            }]
          }]
        }]
      }]
    };

    var serviceTemplate = {id: 123, service_template_catalog_id: 321};

    var controllerResolves = {
      dialogs: dialogs,
      serviceTemplate: serviceTemplate
    };

    beforeEach(function() {
      bard.inject('$controller', '$log', '$state', '$rootScope', 'CollectionsApi', 'Notifications', 'DialogFieldRefresh', 'ShoppingCart');
   });

    describe('controller initialization', function() {
      it('is created successfully', function() {
        controller = $controller($state.get('catalogs.details').controller, controllerResolves);
        expect(controller).to.be.defined;
      });


      describe('#addToCartDisabled', function() {
        context('when the cart is not allowed', function() {
          beforeEach(function() {
            sinon.stub(ShoppingCart, 'allowed').callsFake(function() {
              return false;
            });

            controller = $controller($state.get('catalogs.details').controller, controllerResolves);
          });

          it('returns true', function() {
            expect(controller.addToCartDisabled()).to.equal(true);
          });
        });

        context('when the cart is allowed', function() {
          beforeEach(function() {
            sinon.stub(ShoppingCart, 'allowed').callsFake(function() {
              return true;
            });
          });

          context('when addingToCart is true', function() {
            beforeEach(function() {
              controller = $controller($state.get('catalogs.details').controller, controllerResolves);
              controller.addingToCart = true;
            });

            it('returns true', function() {
              expect(controller.addToCartDisabled()).to.equal(true);
            });
          });

          context('when addingToCart is false', function() {
            context('when any dialogs are being refreshed', function() {
              beforeEach(function() {
                dialogs.resources[0].content[0].dialog_tabs[0].dialog_groups[0].dialog_fields[0].beingRefreshed = true;

                controller = $controller($state.get('catalogs.details').controller, controllerResolves);
                controller.addingToCart = false;
              });

              it('returns true', function() {
                expect(controller.addToCartDisabled()).to.equal(true);
              });
            });

            context('when no dialogs are being refreshed', function() {
              beforeEach(function() {
                controller = $controller($state.get('catalogs.details').controller, controllerResolves);
                controller.addingToCart = false;
                controller.addToCartEnabled = true;
              });

              it('returns false', function() {
                expect(controller.addToCartDisabled()).to.equal(false);
              });
            });
          });
        });
      });
    });
  });
});

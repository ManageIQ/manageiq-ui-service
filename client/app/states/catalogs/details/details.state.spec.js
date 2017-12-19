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
  });

  describe('controller', function() {
    var collectionsApiSpy;
    var controller;
    var notificationsErrorSpy;
    var notificationsSuccessSpy;
    var refreshSingleFieldSpy;
    var autoRefreshSpy;
    var dialogSpy;
    var serviceTemplateSpy;

    var dialogFields = [{
      name: 'dialogField1',
      default_value: '1',
      auto_refresh: true,
      refreshableFieldIndex: 0,
      beingRefreshed: false,
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

    beforeEach(function() {
      bard.inject('$controller', '$log', '$state','$stateParams', '$rootScope', 'CollectionsApi', 'Notifications', 'DialogFieldRefresh', 'AutoRefresh', 'ShoppingCart');

      autoRefreshSpy = sinon.stub(AutoRefresh, 'listenForAutoRefresh').callsFake(function() {
        return false;
      });
      
      refreshSingleFieldSpy = sinon.stub(DialogFieldRefresh, 'refreshSingleDialogField');
      $stateParams.serviceRequestId = 123;
      serviceTemplateSpy = sinon.stub(CollectionsApi, 'get').returns(Promise.resolve(serviceTemplate));
    });

    describe('controller initialization', function() {
      it('is created successfully', function() {
        dialogSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(dialogs));
        controller = $controller($state.get('catalogs.details').controller);
        expect(controller).to.be.defined;
      });

      it('listens for auto refresh messages', function(done) {
        dialogSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(dialogs));
        controller = $controller($state.get('catalogs.details').controller);
        controller.init();
        done();
        var refreshableField = [{"name":"dialogField1","default_value":"1","auto_refresh":true,"refreshableFieldIndex":0, beingRefreshed: false}];
        expect(autoRefreshSpy).to.have.been.calledWith(
          dialogFields, refreshableField, 'service_catalogs/321/service_templates', 123, refreshSingleFieldSpy
        );
      });

      describe('#addToCartDisabled', function() {
        context('when the cart is not allowed', function() {
          beforeEach(function() {
            sinon.stub(ShoppingCart, 'allowed').callsFake(function() {
              return false;
            });

            controller = $controller($state.get('catalogs.details').controller);
          });

          it('returns true', function(done) {
            controller.init();
            done();
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
              controller = $controller($state.get('catalogs.details').controller);
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
                dialogSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(dialogs));
                controller = $controller($state.get('catalogs.details').controller);
                controller.addingToCart = false;
              });

              it('returns true', function(done) {
                controller.init();
                done();
                expect(controller.addToCartDisabled()).to.equal(true);
              });
            });

            context('when no dialogs are being refreshed', function() {
              beforeEach(function() {
                dialogs.resources[0].content[0].dialog_tabs[0].dialog_groups[0].dialog_fields[0].beingRefreshed = false;

                controller = $controller($state.get('catalogs.details').controller);
                controller.addingToCart = false;
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

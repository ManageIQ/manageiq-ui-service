describe('Catalogs.details', function() {
  beforeEach(function() {
    module('app.states');
  });

  describe('#resolveDialogs', function() {
    var collectionsApiSpy;
    const serviceRequest = false;
    beforeEach(function() {
      bard.inject('$state', '$stateParams', 'CollectionsApi');
      $stateParams.serviceTemplateId = 123;
      collectionsApiSpy = sinon.spy(CollectionsApi, 'query');
    });

    it('should query the API with the correct template id and options', function() {
      var options = {expand: 'resources', attributes: 'content'};
      $state.get('catalogs.details').resolve.dialogs($stateParams, serviceRequest, CollectionsApi);
      expect(collectionsApiSpy).to.have.been.calledWith('service_templates/123/service_dialogs', options);
    });

    it('should query the API for service templates', function() {
      const serviceTemplateSpy = sinon.spy(CollectionsApi, 'get');
      var options = { attributes: "picture,picture.image_href" };
      $state.get('catalogs.details').resolve.serviceTemplate($stateParams, serviceRequest, CollectionsApi);
      expect(serviceTemplateSpy).to.have.been.calledWith('service_templates',123, options);
    });
    it('should query the API for serviceRequest if one is set', () => {
      const serviceRequestSpy = sinon.spy(CollectionsApi, 'get');
      $stateParams.serviceRequestId = 12345;
      const options = {}
      $state.get('catalogs.duplicate').resolve.serviceRequest($stateParams, CollectionsApi);
      expect(serviceRequestSpy).to.have.been.calledWith('requests',12345, options);
    })
  });

  describe('controller', function() {
    var collectionsApiSpy;
    var controller;
    var refreshSingleFieldSpy;

    var dialogFields = [{
      name: 'dialogField1',
      default_value: '1'
    }, {
      name: 'dialogField2',
      default_value: '2'
    }]

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
    }

    var serviceTemplate = {id: 123, service_template_catalog_id: 321, name: 'test template'}

    var controllerResolves = {
      dialogs: dialogs,
<<<<<<< HEAD
      serviceTemplate: serviceTemplate
    }
=======
      serviceTemplate: serviceTemplate,
      serviceRequest: false
    };
>>>>>>> [Finishes #146028835] Allowed users to duplicate services

    beforeEach(function () {
      bard.inject('$controller', '$log', '$state', '$rootScope', 'CollectionsApi', 'EventNotifications', 'DialogFieldRefresh', 'ShoppingCart')
    })

    describe('controller initialization', function () {
      it('is created successfully', function () {
        controller = $controller($state.get('catalogs.details').controller, controllerResolves)
        expect(controller).to.be.defined
      })
      it('it allows a field to be refreshed', () => {
        controller = $controller($state.get('catalogs.details').controller, controllerResolves)
        const refreshSpy = sinon.stub(DialogFieldRefresh, 'refreshDialogField').returns(Promise.resolve({'status': 'success'}))
        const dialogData = {
          'dialogField1': '1',
          'dialogField2': '2'
        }
        const field = {'name': 'dialogField1'}
        controller.dialogData = dialogData
        return controller.refreshField(field).then((data) => {
          expect(refreshSpy).to.have.been.calledWith(dialogData, ['dialogField1'], 'service_catalogs/321/service_templates', 123)
        })

      })
      it('allows dialog data to be updated', () => {
        const testData = {
          validations: {isValid: true},
          data: {
            'dialogField1': '1',
            'dialogField2': '2'
          }
        }
        controller.setDialogData(testData)
        expect(controller.dialogData).to.deep.equal({'dialogField1': '1', 'dialogField2': '2'})
      })

      describe('#addToCartDisabled', function () {

        context('when the cart is not allowed', function () {
          beforeEach(function () {
            sinon.stub(ShoppingCart, 'allowed').callsFake(function () {
              return false
            })

            controller = $controller($state.get('catalogs.details').controller, controllerResolves)
          })

          it('returns true', function () {
            expect(controller.addToCartDisabled()).to.equal(true)
          })
          it('fails to add to cart', () => {
            const addToCart = controller.addToCart()
            expect(addToCart).to.equal(undefined)
          })
        })

        context('when the cart is allowed', function () {
          beforeEach(function () {
            sinon.stub(ShoppingCart, 'allowed').callsFake(function () {
              return true
            })
          })

          context('when addingToCart is true', function () {
            beforeEach(function () {
              controller = $controller($state.get('catalogs.details').controller, controllerResolves)
              controller.addingToCart = true
              controller.dialogData = {
                'dialogField1': '1',
                'dialogField2': '2'
              }
            })

            it('returns true', function () {
              expect(controller.addToCartDisabled()).to.equal(true)
            })

            it('add to cart successfully', () => {
              const addSpy = sinon.stub(ShoppingCart, 'add').returns(Promise.resolve(''))
              controller.addToCart()
              const expectedObject = {
                data: {
                  dialogField1: '1',
                  dialogField2: '2',
                  service_template_href: '/api/service_templates/123'
                },
                description: 'test template'
              }
              expect(addSpy).to.have.been.calledWith(expectedObject)
            })
            it('adds successfully but is a duplicate', () => {
              const addSpy = sinon.stub(ShoppingCart, 'add').returns(Promise.resolve({'duplicate': true}))
              const notificationsSuccessSpy = sinon.spy(EventNotifications, 'success')

              return controller.addToCart().then((data) => {
                expect(notificationsSuccessSpy).to.have.been.calledWith(`Item added to shopping cart, but it's a duplicate of an existing item`)
              })
            })
            it('fails to add to cart', () => {
              const addSpy = sinon.stub(ShoppingCart, 'add').returns(Promise.reject('generic error'))
              const notificationsErrorSpy = sinon.spy(EventNotifications, 'error')
              return controller.addToCart().then((data) => {
                expect(notificationsErrorSpy).to.have.been.calledWith(`There was an error adding to shopping cart: generic error`)
              })
            })
          })
          context('when you check for a duplicate cart', () => {
            beforeEach(function () {
              controller = $controller($state.get('catalogs.details').controller, controllerResolves)
              controller.addingToCart = true
            })
            it('checks for a duplicate cart', () => {
              const shoppingCartSpy = sinon.stub(ShoppingCart, 'isDuplicate').returns(false)
              controller.dialogData = {
                'dialogField1': '1',
                'dialogField2': '2'
              }
              const expectedData = controller.dialogData
              expectedData.service_template_href = '/api/service_templates/123'
              controller.alreadyInCart()
              expect(shoppingCartSpy).to.have.been.calledWith(expectedData)
            })
          })
          context('when addingToCart is false', function () {
            context('when any dialogs are being refreshed', function () {
              beforeEach(function () {
                dialogs.resources[0].content[0].dialog_tabs[0].dialog_groups[0].dialog_fields[0].beingRefreshed = true

                controller = $controller($state.get('catalogs.details').controller, controllerResolves)
                controller.addingToCart = false
              })

              it('returns true', function () {
                expect(controller.addToCartDisabled()).to.equal(true)
              })
            })

            context('when no dialogs are being refreshed', function () {
              beforeEach(function () {
                controller = $controller($state.get('catalogs.details').controller, controllerResolves)
                controller.addingToCart = false
                controller.addToCartEnabled = true
              })

              it('returns false', function () {
                expect(controller.addToCartDisabled()).to.equal(false)
              })
            })
          })
        })
      })
    })
  })
})

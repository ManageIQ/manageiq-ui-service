/* global $state, $stateParams, CollectionsApi, $controller, DialogFieldRefresh, context, ShoppingCart, EventNotifications */
/* eslint-disable no-unused-expressions */
describe('State: catalogs.details', () => {
  beforeEach(() => {
    module('app.states')
  })

  describe('#resolveDialogs', () => {
    let collectionsApiSpy
    const serviceRequest = false
    beforeEach(() => {
      bard.inject('$state', '$stateParams', 'CollectionsApi')
      $stateParams.serviceTemplateId = 123
      collectionsApiSpy = sinon.spy(CollectionsApi, 'query')
    })

    it('should query the API with the correct template id and options', () => {
      const options = {expand: 'resources', attributes: 'content'}
      $state.get('catalogs.details').resolve.dialogs($stateParams, serviceRequest, CollectionsApi)
      expect(collectionsApiSpy).to.have.been.calledWith('service_templates/123/service_dialogs', options)
    })

    it('should query the API for service templates', () => {
      const serviceTemplateSpy = sinon.spy(CollectionsApi, 'get')
      const options = {attributes: ['picture', 'picture.image_href']}
      $state.get('catalogs.details').resolve.serviceTemplate($stateParams, serviceRequest, CollectionsApi)
      expect(serviceTemplateSpy).to.have.been.calledWith('service_templates', 123, options)
    })
    it('should query the API for serviceRequest if one is set', () => {
      const serviceRequestSpy = sinon.spy(CollectionsApi, 'get')
      $stateParams.serviceRequestId = 12345
      const options = {}
      $state.get('catalogs.duplicate').resolve.serviceRequest($stateParams, CollectionsApi)
      expect(serviceRequestSpy).to.have.been.calledWith('requests', 12345, options)
    })
  })

  describe('controller', () => {
    let controller

    const dialogFields = [{
      name: 'dialogField1',
      default_value: '1'
    }, {
      name: 'dialogField2',
      default_value: '2'
    }]

    const dialogs = {
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

    const serviceTemplate = {id: 123, service_template_catalog_id: 321, name: 'test template'}

    const controllerResolves = {
      dialogs: dialogs,
      serviceTemplate: serviceTemplate,
      serviceRequest: false
    }

    beforeEach(() => {
      bard.inject('$controller', '$log', '$state', '$rootScope', 'CollectionsApi', 'EventNotifications', 'DialogFieldRefresh', 'ShoppingCart')
    })

    describe('controller initialization', () => {
      it('is created successfully', () => {
        controller = $controller($state.get('catalogs.details').controller, controllerResolves)
        expect(controller).to.be.defined
      })
      it('it allows a field to be refreshed', (done) => {
        controller = $controller($state.get('catalogs.details').controller, controllerResolves)
        const refreshSpy = sinon.stub(DialogFieldRefresh, 'refreshDialogField').returns(Promise.resolve({'status': 'success'}))
        const dialogData = {
          'dialogField1': '1',
          'dialogField2': '2'
        }
        const field = {'name': 'dialogField1'}
        controller.dialogData = dialogData
        controller.refreshField(field).then((data) => {
          done()

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

      describe('#addToCartDisabled', () => {
        context('when the cart is not allowed', () => {
          beforeEach(() => {
            sinon.stub(ShoppingCart, 'allowed').callsFake(() => {
              return false
            })

            controller = $controller($state.get('catalogs.details').controller, controllerResolves)
          })

          it('returns true', () => {
            expect(controller.addToCartDisabled()).to.equal(true)
          })
          it('fails to add to cart', () => {
            const addToCart = controller.addToCart()
            expect(addToCart).to.equal(undefined)
          })
        })

        context('when the cart is allowed', () => {
          beforeEach(() => {
            sinon.stub(ShoppingCart, 'allowed').callsFake(() => {
              return true
            })
          })

          context('when addingToCart is true', () => {
            beforeEach(() => {
              controller = $controller($state.get('catalogs.details').controller, controllerResolves)
              controller.addingToCart = true
              controller.dialogData = {
                'dialogField1': '1',
                'dialogField2': '2'
              }
            })

            it('returns true', () => {
              expect(controller.addToCartDisabled()).to.equal(true)
            })

            it('add to cart successfully', (done) => {
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
              done()

              expect(addSpy).to.have.been.calledWith(expectedObject)
            })
            it('adds successfully but is a duplicate', (done) => {
              sinon.stub(ShoppingCart, 'add').returns(Promise.resolve({'duplicate': true}))
              const notificationsSuccessSpy = sinon.spy(EventNotifications, 'success')

              controller.addToCart().then((data) => {
                done()

                expect(notificationsSuccessSpy).to.have.been.calledWith(`Item added to shopping cart, but it's a duplicate of an existing item`)
              })
            })
            it('fails to add to cart', (done) => {
              const error = 'generic error'
              sinon.stub(ShoppingCart, 'add').returns(Promise.reject(error))
              const notificationsErrorSpy = sinon.spy(EventNotifications, 'error')
              controller.addToCart().then((data) => {
                done()

                expect(notificationsErrorSpy).to.have.been.calledWith(`There was an error adding to shopping cart: generic error`)
              })
            })
          })
          context('when you check for a duplicate cart', () => {
            beforeEach(() => {
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
          context('when addingToCart is false', () => {
            context('when any dialogs are being refreshed', () => {
              beforeEach(() => {
                dialogs.resources[0].content[0].dialog_tabs[0].dialog_groups[0].dialog_fields[0].beingRefreshed = true

                controller = $controller($state.get('catalogs.details').controller, controllerResolves)
                controller.addingToCart = false
              })

              it('returns true', () => {
                expect(controller.addToCartDisabled()).to.equal(true)
              })
            })

            context('when no dialogs are being refreshed', () => {
              beforeEach(() => {
                controller = $controller($state.get('catalogs.details').controller, controllerResolves)
                controller.addingToCart = false
                controller.addToCartEnabled = true
              })

              it('returns false', () => {
                expect(controller.addToCartDisabled()).to.equal(false)
              })
            })
          })
        })
      })
    })
  })
})

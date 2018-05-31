/* global $state, $stateParams, $controller, DialogFieldRefresh, context, ShoppingCart, EventNotifications */
/* eslint-disable no-unused-expressions */
describe('State: catalogs.details', () => {
  beforeEach(() => {
    module('app.states')
  })

  describe('#resolveDialogs', () => {
    beforeEach(() => {
      bard.inject('$state', '$stateParams', 'CollectionsApi')
      $stateParams.serviceTemplateId = 123
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

    const serviceTemplate = {
      id: 123,
      service_template_catalog_id: 321,
      name: 'test template',
      resource_actions: [
        {
          action: 'Provision',
          id: 1234
        }
      ]
    }

    beforeEach(() => {
      bard.inject('$controller', '$log', '$state', '$stateParams', '$rootScope', 'EventNotifications', 'DialogFieldRefresh', 'ShoppingCart')
      $stateParams.serviceTemplateId = 1234
    })

    describe('controller initialization', () => {
      it('is created successfully', () => {
        controller = $controller($state.get('catalogs.details').controller)
        expect(controller).to.be.defined
      })
      it('it allows a field to be refreshed', (done) => {
        controller = $controller($state.get('catalogs.details').controller)
        controller.serviceTemplate = serviceTemplate
        controller.setDialogUrl()
        const refreshSpy = sinon.stub(DialogFieldRefresh, 'refreshDialogField').returns(Promise.resolve({'status': 'success'}))
        const dialogData = {
          'dialogField1': '1',
          'dialogField2': '2'
        }
        const parsedDialogs = [
          {
            id: 1234
          }
        ]
        const field = {'name': 'dialogField1'}
        const idList = {
          dialogId: 1234,
          resourceActionId: 1234,
          targetId: 123,
          targetType: 'service_template'
        }
        controller.dialogData = dialogData
        controller.parsedDialogs = parsedDialogs

        controller.refreshField(field).then((data) => {
          done()
        })
        const url = `service_dialogs`
        expect(refreshSpy).to.have.been.calledWith(dialogData, ['dialogField1'], url, idList)
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

            controller = $controller($state.get('catalogs.details').controller)
            controller.serviceTemplate = serviceTemplate
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
              controller = $controller($state.get('catalogs.details').controller)
              controller.addingToCart = true
              controller.serviceTemplate = serviceTemplate
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
              controller = $controller($state.get('catalogs.details').controller)
              controller.addingToCart = true
              controller.serviceTemplate = serviceTemplate
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

                controller = $controller($state.get('catalogs.details').controller)
                controller.addingToCart = false
              })

              it('returns true', () => {
                expect(controller.addToCartDisabled()).to.equal(true)
              })
            })

            context('when no dialogs are being refreshed', () => {
              beforeEach(() => {
                controller = $controller($state.get('catalogs.details').controller)
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

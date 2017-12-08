/* global $state, $controller, CollectionsApi, Notifications, DialogFieldRefresh */
/* eslint-disable no-unused-expressions */
describe('State: services.custom_button_details', () => {
  beforeEach(() => {
    module('app.states')
  })

  describe('controller', () => {
    let collectionsApiSpy, controller, notificationsErrorSpy, notificationsSuccessSpy
    const dialogFields = [{
      name: 'dialogField1',
      default_value: '1'
    }, {
      name: 'dialogField2',
      default_value: '2'
    }]
    const dialog = {
      dialog_tabs: [{
        dialog_groups: [{
          dialog_fields: dialogFields
        }]
      }]
    }
    const button = {
      name: 'buttonName',
      applies_to_id: 456,
      applies_to_class: 'servicetemplate',
      resource_action: {
        dialog_id: 1
      }
    }

    beforeEach(() => {
      bard.inject('$controller', '$log', '$state', '$stateParams', '$rootScope', 'CollectionsApi', 'Notifications', 'DialogFieldRefresh')

      sinon.stub(DialogFieldRefresh, 'refreshDialogField')

      const apiQueries = sinon.stub(CollectionsApi, 'get')
      apiQueries.onFirstCall().returns(Promise.resolve(dialog))
      apiQueries.onSecondCall().returns(Promise.resolve({}))
      controller = $controller($state.get('services.custom_button_details').controller, {
        $stateParams: {
          dialogId: 213,
          button: button,
          serviceId: 123,
          serviceTemplateCatalogId: 321
        }
      })
      const dialogData = {
        'validations': {
          'isValid': true
        },
        'data': {
          'dialogField1': 1,
          'dialogField2': 2
        }
      }
      controller.setDialogData(dialogData)
    })

    describe('controller initialization', () => {
      it('is created successfully', () => {
        expect(controller).to.be.defined
      })
    })
    describe('dialog values are updated', () => {
      it('has values updated', () => {
        const dialogValues = {
          'dialogField1': 1,
          'dialogField2': 2
        }
        expect(controller.dialogData).to.eql(dialogValues)
      })
    })
    describe('controller#submitCustomButton', () => {
      describe('when the API call is successful', () => {
        beforeEach(() => {
          const successResponse = {
            message: 'Great Success!'
          }

          collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse))
          notificationsSuccessSpy = sinon.spy(Notifications, 'success')
        })

        it('POSTs to the services API', () => {
          controller.submitCustomButton()
          expect(collectionsApiSpy).to.have.been.calledWith(
            'services',
            123,
            {},
            '{"action":"buttonName","resource":{"dialogField1":1,"dialogField2":2}}'
          )
        })

        it('makes a notification success call', (done) => {
          controller.submitCustomButton()
          done()
          expect(notificationsSuccessSpy).to.have.been.calledWith('Great Success!')
        })

        it('goes to the service details', (done) => {
          controller.submitCustomButton()
          done()
          expect($state.is('services.details')).to.be.true
        })
      })

      describe('when the API call fails', () => {
        beforeEach(() => {
          const errorResponse = 'oopsies'

          collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(errorResponse))
          notificationsErrorSpy = sinon.spy(Notifications, 'error')
        })

        it('makes a notification error call', (done) => {
          controller.submitCustomButton()
          done()
          expect(notificationsErrorSpy).to.have.been.calledWith(
            'There was an error submitting this request: oopsies'
          )
        })
      })
    })
  })

  describe('Custom button actions for a VM', () => {
    let collectionsApiSpy, controller

    const dialogFields = [{
      name: 'dialogField1',
      default_value: '1'
    }, {
      name: 'dialogField2',
      default_value: '2'
    }]
    const dialog = {
      dialog_tabs: [{
        dialog_groups: [{
          dialog_fields: dialogFields
        }]
      }]
    }
    const button = {
      name: 'buttonName',
      applies_to_id: 456,
      applies_to_class: 'vm',
      resource_action: {
        dialog_id: 1
      }
    }

    beforeEach(() => {
      bard.inject('$controller', '$log', '$state', '$stateParams', '$rootScope', 'CollectionsApi', 'Notifications', 'DialogFieldRefresh')
      sinon.stub(DialogFieldRefresh, 'refreshDialogField')
      const dialogResponse = {content: [dialog], id: 213}
      const apiQueries = sinon.stub(CollectionsApi, 'get')
      apiQueries.onFirstCall().returns(Promise.resolve(dialogResponse))
      apiQueries.onSecondCall().returns(Promise.resolve({}))

      controller = $controller($state.get('services.custom_button_details').controller, {
        $stateParams: {
          dialogId: 213,
          button: button,
          serviceId: 123,
          vmId: 456,
          serviceTemplateCatalogId: 321
        }
      })
      const dialogData = {
        'validations': {
          'isValid': true
        },
        'data': {
          'dialogField1': 1,
          'dialogField2': 2
        }
      }
      controller.setDialogData(dialogData)
    })
    it('POSTs to the vms API', (done) => {
      const successResponse = {
        message: 'Great Success!'
      }

      collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse))
      sinon.spy(Notifications, 'success')

      controller.submitCustomButton()
      done()

      expect(collectionsApiSpy).to.have.been.calledWith(
        'vms',
        456,
        {},
        '{"action":"buttonName","resource":{"dialogField1":1,"dialogField2":2}}'
      )
    })
    it('goes to the resource details', (done) => {
      controller.submitCustomButton()
      done()
      expect($state.is('services.resource-details')).to.be.true
    })
  })
})

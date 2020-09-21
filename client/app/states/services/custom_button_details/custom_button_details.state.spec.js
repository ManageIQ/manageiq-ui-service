/* global $state, $controller, CollectionsApi, Notifications, DialogFieldRefresh, DialogData */
/* eslint-disable no-unused-expressions */
describe('State: services.custom_button_details', () => {
  const dialogId = 213
  const serviceId = 123

  let dialog, dialogData, dialogFields, button, dialogResponse

  beforeEach(() => {
    module('app.states')

    dialogFields = [{
      name: 'dialogField1',
      default_value: '1'
    }, {
      name: 'dialogField2',
      default_value: '2'
    }]

    dialog = {
      dialog_tabs: [{
        dialog_groups: [{
          dialog_fields: dialogFields
        }]
      }]
    }

    button = {
      name: 'buttonName',
      applies_to_id: 456,
      applies_to_class: 'servicetemplate',
      resource_action: {
        dialog_id: 1,
        id: 789
      }
    }

    dialogData = {
      'validations': {
        'isValid': true
      },
      'data': {
        'dialogField1': 1,
        'dialogField2': 2
      }
    }

    dialogResponse = {
      content: [dialog],
      id: dialogId
    }

    module('miqStaticAssets.dialogUser');
    bard.inject('DialogData');
    DialogData.data = {
      fields: dialogFields,
    };
  })

  describe('for a service', () => {
    it('sends target_type=service service dialog query on init', (done) => {
      bard.inject('$controller', '$state', '$stateParams', 'CollectionsApi')
      const spy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(dialogResponse))
      const resourceActionId = button.resource_action.id

      $controller($state.get('services.custom_button_details').controller, {
        $stateParams: {
          dialogId,
          button,
          serviceId,
          serviceTemplateCatalogId: 321
        }
      })

      done()

      expect(spy).to.have.been.calledWith(`service_dialogs/${dialogId}`, {
        expand: 'resources',
        attributes: 'content',
        resource_action_id: resourceActionId,
        target_type: 'service',
        target_id: serviceId
      })
    })

    describe('after init', () => {
      let collectionsApiSpy, controller, notificationsErrorSpy, notificationsSuccessSpy

      beforeEach(() => {
        bard.inject('$controller', '$log', '$state', '$stateParams', '$rootScope', 'CollectionsApi', 'Notifications', 'DialogFieldRefresh')

        sinon.stub(DialogFieldRefresh, 'refreshDialogField')

        const apiQueries = sinon.stub(CollectionsApi, 'get')
        apiQueries.onFirstCall().returns(Promise.resolve(dialog))
        apiQueries.onSecondCall().returns(Promise.resolve({}))
        controller = $controller($state.get('services.custom_button_details').controller, {
          $stateParams: {
            dialogId,
            button,
            serviceId,
            serviceTemplateCatalogId: 321
          }
        })
        controller.setDialogData(dialogData)
      })

      describe('controller initialization', () => {
        it('is created successfully', () => {
          expect(controller).to.exist
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
              serviceId,
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
  })

  describe('Custom button actions for a VM', () => {
    let collectionsApiSpy, controller

    const button = {
      name: 'buttonName',
      applies_to_id: 456,
      applies_to_class: 'vm',
      resource_action: {
        dialog_id: 1,
        id: 789
      }
    }

    it('sends target_type=vm service dialog query on init', (done) => {
      bard.inject('$controller', '$state', '$stateParams', 'CollectionsApi')
      const spy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(dialogResponse))
      const vmId = 456
      const resourceActionId = button.resource_action.id

      $controller($state.get('services.custom_button_details').controller, {
        $stateParams: {
          dialogId,
          button: button,
          serviceId,
          vmId,
          serviceTemplateCatalogId: 321
        }
      })

      done()

      expect(spy).to.have.been.calledWith(`service_dialogs/${dialogId}`, {
        expand: 'resources',
        attributes: 'content',
        resource_action_id: resourceActionId,
        target_type: 'vm',
        target_id: vmId
      })
    })

    describe('after init', () => {
      beforeEach(() => {
        bard.inject('$controller', '$log', '$state', '$stateParams', '$rootScope', 'CollectionsApi', 'Notifications', 'DialogFieldRefresh')
        sinon.stub(DialogFieldRefresh, 'refreshDialogField')
        const apiQueries = sinon.stub(CollectionsApi, 'get')
        apiQueries.onFirstCall().returns(Promise.resolve(dialogResponse))
        apiQueries.onSecondCall().returns(Promise.resolve({}))

        controller = $controller($state.get('services.custom_button_details').controller, {
          $stateParams: {
            dialogId,
            button: button,
            serviceId,
            vmId: 456,
            serviceTemplateCatalogId: 321
          }
        })

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

  describe('controller#refreshField', () => {
    let controller

    describe('when the vmId does not exist', () => {
      beforeEach(() => {
        bard.inject('$controller', '$state', '$stateParams', 'CollectionsApi', 'Notifications', 'DialogFieldRefresh')
        sinon.stub(DialogFieldRefresh, 'refreshDialogField')

        controller = $controller($state.get('services.custom_button_details').controller, {
          dialog: dialogResponse,
          service: {},
          $stateParams: {
            dialogId,
            button: button,
            serviceId,
            serviceTemplateCatalogId: 321
          }
        })

        controller.setDialogData(dialogData)
      })

      it('delegates to DialogFieldRefresh with the right id list', () => {
        controller.refreshField({name: 'fieldName'})
        expect(DialogFieldRefresh.refreshDialogField).to.have.been.calledWith(
          dialogData.data,
          ['fieldName'],
          'service_dialogs',
          {dialogId, resourceActionId: 789, targetId: serviceId, targetType: 'service'}
        )
      })
    })

    describe('when the vmId exists', () => {
      beforeEach(() => {
        bard.inject('$controller', '$state', '$stateParams', 'CollectionsApi', 'Notifications', 'DialogFieldRefresh')
        sinon.stub(DialogFieldRefresh, 'refreshDialogField')

        controller = $controller($state.get('services.custom_button_details').controller, {
          dialog: dialogResponse,
          service: {},
          $stateParams: {
            dialogId,
            button: button,
            serviceId,
            vmId: 456,
            serviceTemplateCatalogId: 321
          }
        })

        controller.setDialogData(dialogData)
      })

      it('delegates to DialogFieldRefresh with the right id list', () => {
        controller.refreshField({name: 'fieldName'})
        expect(DialogFieldRefresh.refreshDialogField).to.have.been.calledWith(
          dialogData.data,
          ['fieldName'],
          'service_dialogs',
          {dialogId, resourceActionId: 789, targetId: 456, targetType: 'vm'}
        )
      })
    })
  })
})

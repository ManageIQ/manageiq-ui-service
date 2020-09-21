/* global $state, $controller, CollectionsApi, Notifications, DialogData */
/* eslint-disable no-unused-expressions */
describe('State: services.reconfigure', () => {
  beforeEach(() => {
    module('app.states');
    module('miqStaticAssets.dialogUser');

    bard.inject('DialogData');

    DialogData.data = {
      fields: {
        dialog1: { name: 'dialogField1' },
        dialog2: { name: 'dialogField2' },
      },
    };
  })

  describe('controller', () => {
    let collectionsApiSpy, ctrl, notificationsErrorSpy, notificationsSuccessSpy, collectionsApiPostSpy
    let dialogFields = [{
      name: 'dialogField1',
      default_value: '1'
    }, {
      name: 'dialogField2',
      default_value: '2'
    }]
    let dialog = {
      dialog_tabs: [{
        dialog_groups: [{
          dialog_fields: dialogFields
        }]
      }]
    }
    const options = {'dialog': {'dialog_dialogField1': '1', 'dialog_dialogField2': '2'}}

    let service = {provision_dialog: dialog, id: 123, service_template_catalog_id: 1234, options: options}

    beforeEach(() => {
      bard.inject('$controller', '$state', '$stateParams', 'CollectionsApi', 'Notifications', 'DialogFieldRefresh')
      collectionsApiSpy = sinon.stub(CollectionsApi, 'get').returns(Promise.resolve(service))
      ctrl = $controller($state.get('services.reconfigure').controller, {
        $stateParams: {
          serviceId: 123
        }
      })
    })

    describe('controller initialization', () => {
      it('is created successfully', () => {
        expect(ctrl).to.exist
      })

      it('resolves data', (done) => {
        ctrl = $controller($state.get('services.reconfigure').controller, {
          $stateParams: {
            serviceId: 123
          }
        })
        done()

        expect(collectionsApiSpy).to.have.been.calledWith('services', 123, {attributes: ['provision_dialog']})
      })
    })

    describe('controller#submitDialog', () => {
      describe('when the API call is successful', () => {
        beforeEach(() => {
          const successResponse = {
            message: 'Great Success!'
          }

          collectionsApiPostSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse))
          notificationsSuccessSpy = sinon.spy(Notifications, 'success')
        })

        it('POSTs to the service templates API', () => {
          const dialogData = {
            'data': {
              'dialogField1': '1',
              'dialogField2': '2'
            }
          }
          ctrl.setDialogData(dialogData)
          ctrl.submitDialog()

          expect(collectionsApiPostSpy).to.have.been.calledWith(
            'services',
            123,
            {},
            '{"action":"reconfigure","resource":{"dialogField1":"1","dialogField2":"2","href":"/api/services/123"}}'
          )
        })

        it('and canceled, does not POST to the service templates API', () => {
          ctrl.cancelDialog()

          expect(collectionsApiPostSpy).to.have.not.been.calledWith(
            'services',
            123,
            {},
            '{"action":"reconfigure","resource":{"href":"/api/services/123","dialogField1":"1","dialogField2":"2"}}'
          )
        })

        it('makes a notification success call', function (done) {
          ctrl.submitDialog()
          done()

          expect(notificationsSuccessSpy).to.have.been.calledWith('Great Success!')
        })

        it('goes to the service details', function (done) {
          ctrl.submitDialog()
          done()

          expect($state.is('services.details')).to.be.true
        })
      })

      describe('when the API call fails', () => {
        beforeEach(() => {
          const errorResponse = 'oopsies'

          collectionsApiPostSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(errorResponse))
          notificationsErrorSpy = sinon.spy(Notifications, 'error')
        })

        it('makes a notification error call', function (done) {
          ctrl.submitDialog()
          done()

          expect(notificationsErrorSpy).to.have.been.calledWith(
            'There was an error submitting this request: oopsies'
          )
        })

        it('goes back to the service details', function (done) {
          ctrl.backToService()
          done()

          expect($state.is('services.details')).to.be.true
        })
      })
    })
  })
})

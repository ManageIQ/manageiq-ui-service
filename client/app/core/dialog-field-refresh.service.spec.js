/* global CollectionsApi, DialogFieldRefresh, DialogData */
describe('DialogFieldRefresh', () => {
  beforeEach(() => {
    module('app.states');
    module('miqStaticAssets.dialogUser');

    bard.inject('CollectionsApi', 'Notifications', 'DialogFieldRefresh', 'DialogData');

    DialogData.data = {
      fields: {
        dialog1: { name: 'dialog1' },
        dialog2: { name: 'dialog2' },
      },
    };
  })

  describe('#refreshDialogField', () => {
    it('allows a dialog field to be refreshed', () => {
      const successResponse = {
        result: {
          dialog1: {
            data_type: 'string',
            options: 'options',
            read_only: false,
            required: false,
            values: 'Text'
          }
        }
      }
      const collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse))
      const dialogData = {
        'dialog1': 'value1',
        'dialog2': 'value2'
      }
      const idList = {
        dialogId: 1234,
        resourceActionId: 4321,
        targetId: 3241,
        targetType: 'targetType'
      }
      DialogFieldRefresh.refreshDialogField(dialogData, ['dialog1'], '/test/1', idList).then((response) => {
        expect(collectionsApiSpy).to.have.been.calledWith('/test/1',
                                                          1234,
                                                          {},
                                                          '{"action":"refresh_dialog_fields","resource":{"dialog_fields":{"dialog1":"value1","dialog2":"value2"},"fields":["dialog1"], "resource_action_id": "4321", "target_id": "3241", "target_type": "targetType"}}')
      })
    })

    it('reports back when a field fails to refresh', () => {
      const dialogData = {
        'dialog1': 'value1',
        'dialog2': 'value2'
      }
      const idList = {
        dialogId: 1234,
        resourceActionId: 4321,
        targetId: 3241,
        targetType: 'targetType'
      }
      const failureResponse = {'status': 'failed'}
      sinon.stub(CollectionsApi, 'post').returns(Promise.reject(failureResponse))
      DialogFieldRefresh.refreshDialogField(dialogData, ['dialog1'], '/test/1', idList).then((response) => {

      }).catch((err) => {
        expect(err).to.eq(failureResponse)
      })
    })
  })

  describe('#setFieldValueDefaults', () => {
    it('can override defaults values for a dialog', () => {
      const testDialog = {
        dialog_tabs: [{
          dialog_groups: [{
            dialog_fields: [
              {'name': 'test1', 'default_value': 'test1'},
              {'name': 'test2', 'default_value': 'test2'}
            ]
          }]
        }]
      }

      const testValues = {
        dialog_test1: 'modifiedTest1',
        dialog_test2: 'modifiedTest2'
      }

      const expectedDialog = {
        'dialog_tabs': [{
          'dialog_groups': [{
            'dialog_fields': [{
              'name': 'test1',
              'default_value': 'modifiedTest1'
            }, {'name': 'test2', 'default_value': 'modifiedTest2'}]
          }]
        }]
      }
      const modifiedDialog = DialogFieldRefresh.setFieldValueDefaults(testDialog, testValues)
      expect(modifiedDialog).to.deep.eq(expectedDialog)
    })
  })
})

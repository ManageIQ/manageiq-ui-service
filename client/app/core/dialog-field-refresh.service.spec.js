describe('DialogFieldRefresh', () => {
  beforeEach(() => {
    module('app.states');
    bard.inject('CollectionsApi', 'Notifications', 'DialogFieldRefresh');
  });

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
    };
    const collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
    const dialogData = {
      'dialog1': 'value1',
      'dialog2': 'value2'
    };
    return DialogFieldRefresh.refreshDialogField(dialogData, ['dialog1'], '/test/1', 1234).then((response) => {
      expect(collectionsApiSpy).to.have.been.calledWith('/test/1',
        1234,
        {},
        '{"action":"refresh_dialog_fields","resource":{"dialog_fields":{"dialog1":"value1","dialog2":"value2"},"fields":["dialog1"]}}');
    })
  });

  it('reports back when a field fails to refresh', () => {
    const dialogData = {
      'dialog1': 'value1',
      'dialog2': 'value2'
    };
    const failureResponse = {"status":"failed"};
    const collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(failureResponse));
    return DialogFieldRefresh.refreshDialogField(dialogData, ['dialog1'], '/test/1', 1234).then((response) => {

    }).catch((err) =>{ 
      expect(err).to.eq(failureResponse);
    });
  });
  it('can override defaults values for a dialog', () => {
    const testDialog = {
      dialog_tabs: [
        {
          dialog_groups: [
            {
              dialog_fields: [
                { "name": "test1", "default_value": "test1" },
                { "name": "test2", "default_value": "test2" },
              ]
            }
          ]
        }
      ]
    };

    const testValues = {
      dialog_test1: "modifiedTest1",
      dialog_test2: "modifiedTest2"
    };

    const expectedDialog = { "dialog_tabs": [{ "dialog_groups": [{ "dialog_fields": [{ "name": "test1", "default_value": "modifiedTest1" }, { "name": "test2", "default_value": "modifiedTest2" }] }] }] };
    const modifiedDialog = DialogFieldRefresh.setFieldValueDefaults(testDialog, testValues);
    expect(modifiedDialog).to.deep.eq(expectedDialog);
  })
});


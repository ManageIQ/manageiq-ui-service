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
});


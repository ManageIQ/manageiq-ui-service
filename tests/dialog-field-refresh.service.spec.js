describe('app.services.DialogFieldRefresh', function() {
  beforeEach(function() {
    module('app.states', 'app.services', bard.fakeToastr);
    bard.inject('CollectionsApi', 'Notifications', 'DialogFieldRefresh');
  });

  describe('#listenForAutoRefreshMessages', function() {
    var eventListenerSpy;

    beforeEach(function() {
      $ = sinon.stub();
      eventListenerSpy = sinon.stub({on: function() {}, off: function() {}});
      $.withArgs(window).returns(eventListenerSpy);
    });

    it('sets up a listener on the window', function() {
      DialogFieldRefresh.listenForAutoRefreshMessages([], [], 'the_url', '123');
      expect(eventListenerSpy.off).to.have.been.calledWith('message');
      expect(eventListenerSpy.on).to.have.been.calledWith('message');
    });
  });

  describe('#refreshSingleDialogField with values not as an object', function() {
    var dialog1 = {name: 'dialog1', default_value: 'name1'};
    var dialog2 = {name: 'dialog2', default_value: 'name2'};
    var allDialogFields = [dialog1, dialog2];
    var collectionsApiSpy;
    var triggerAutoRefreshSpy;

    describe('when the API call is successful', function() {
      var successResponse;

      describe('when the dialogfield type is DialogFieldDateControl', function() {
        beforeEach(function() {
          successResponse = {
            result: {
              dialog1: {
                type: 'DialogFieldDateControl',
                options: 'options',
                read_only: false,
                required: false,
                values: '2016-01-02T00:00:00+00:00Z'
              }
            }
          };

          triggerAutoRefreshSpy = sinon.stub(DialogFieldRefresh, 'triggerAutoRefresh');
          collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
        });

        it('updates the attributes for the dialog field', function(done) {
          DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialog1, 'the_url', 123);
          done();
          expect(dialog1.options).to.eq('options');
          expect(dialog1.read_only).to.be.false;
          expect(dialog1.required).to.be.false;
          expect(dialog1.default_value).to.eq(new Date('2016-01-02T00:00:00+00:00Z'));
        });

        it('triggers an auto-refresh', function(done) {
          DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialog1, 'the_url', 123);
          done();
          expect(triggerAutoRefreshSpy).to.have.been.called;
        });
      });

      describe('when the dialogfield type is DialogFieldDateTimeControl', function() {
        beforeEach(function() {
          successResponse = {
            result: {
              dialog1: {
                type: 'DialogFieldDateTimeControl',
                options: 'options',
                read_only: false,
                required: false,
                values: '2016-01-02T12:34:00+00:00Z'
              }
            }
          };

          triggerAutoRefreshSpy = sinon.stub(DialogFieldRefresh, 'triggerAutoRefresh');
          collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
        });

        it('updates the attributes for the dialog field', function(done) {
          DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialog1, 'the_url', 123);
          done();
          expect(dialog1.options).to.eq('options');
          expect(dialog1.read_only).to.be.false;
          expect(dialog1.required).to.be.false;
          expect(dialog1.default_value).to.eq('Text');
          expect(dialog1.default_value).to.eq(new Date('2016-01-02T12:34:00+00:00Z'));
        });

        it('triggers an auto-refresh', function(done) {
          DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialog1, 'the_url', 123);
          done();
          expect(triggerAutoRefreshSpy).to.have.been.called;
        });
      });

      describe('when the dialogfield type is anything else', function() {
        beforeEach(function() {
          successResponse = {
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

          triggerAutoRefreshSpy = sinon.stub(DialogFieldRefresh, 'triggerAutoRefresh');
          collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
        });

        it('updates the attributes for the dialog field', function(done) {
          DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialog1, 'the_url', 123);
          done();
          expect(dialog1.data_type).to.eq('string');
          expect(dialog1.options).to.eq('options');
          expect(dialog1.read_only).to.be.false;
          expect(dialog1.required).to.be.false;
          expect(dialog1.default_value).to.eq('Text');
        });

        it('triggers an auto-refresh', function(done) {
          DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialog1, 'the_url', 123);
          done();
          expect(triggerAutoRefreshSpy).to.have.been.called;
        });
      });
    });
  });

  describe('#refreshSingleDialogField with values as an object', function() {
    var dialog1 = {name: 'dialog1', default_value: 'name1'};
    var dialog2 = {name: 'dialog2', default_value: 'name2'};
    var allDialogFields = [dialog1, dialog2];
    var collectionsApiSpy;
    var triggerAutoRefreshSpy;

    describe('when the API call is successful', function() {
      var successResponse;

      beforeEach(function() {
        successResponse = {
          result: {
            dialog1: {
              default_value: 'new default value',
              data_type: 'string',
              options: 'options',
              read_only: false,
              required: false,
              values: [['1', 'One'], ['2', 'Two']]
            }
          }
        };

        triggerAutoRefreshSpy = sinon.stub(DialogFieldRefresh, 'triggerAutoRefresh');
        collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse));
      });

      describe('when the default value is not given', function() {
        beforeEach(function() {
          successResponse = {
            result: {
              dialog1: {
                data_type: 'integer',
                options: 'options',
                read_only: false,
                required: false,
                values: [[1, 'One'], [2, 'Two']]
              }
            }
          };
        });

        it('updates the attributes for the dialog field with the first value being default', function(done) {
          DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialog1, 'the_url', 123);
          done();
          expect(dialog1.data_type).to.eq('integer');
          expect(dialog1.options).to.eq('options');
          expect(dialog1.read_only).to.be.false;
          expect(dialog1.required).to.be.false;
          var dialog1Values = JSON.stringify(dialog1.values);
          var dialog1ExpectedValues = JSON.stringify([[1, 'One'], [2, 'Two']]);
          expect(dialog1Values).to.eq(dialog1ExpectedValues);
          expect(dialog1.default_value).to.eq('1');
        });
      });

      describe('when the default value is given', function() {
        it('updates the attributes for the dialog field', function(done) {
          DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialog1, 'the_url', 123);
          done();
          expect(dialog1.data_type).to.eq('string');
          expect(dialog1.options).to.eq('options');
          expect(dialog1.read_only).to.be.false;
          expect(dialog1.required).to.be.false;
          var dialog1Values = JSON.stringify(dialog1.values);
          var dialog1ExpectedValues = JSON.stringify([['1', 'One'], ['2', 'Two']]);
          expect(dialog1Values).to.eq(dialog1ExpectedValues);
          expect(dialog1.default_value).to.eq('new default value');
        });
      });

      it('calls the API with the correct parameters', function(done) {
        DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialog1, 'the_url', 123);
        done();
        expect(collectionsApiSpy).to.have.been.calledWith(
          'the_url',
          123,
          {},
          JSON.stringify({
            action: 'refresh_dialog_fields',
            resource: {
              dialog_fields: {dialog1: 'name1', dialog2: 'name2'},
              fields: ['dialog1']
            }
          })
        );
      });

      it('triggers an auto-refresh', function(done) {
        DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialog1, 'the_url', 123);
        done();
        expect(triggerAutoRefreshSpy).to.have.been.called;
      });
    });

    describe('when the API call fails', function() {
      var notificationsErrorSpy;

      beforeEach(function() {
        var errorResponse = 'oopsies';

        notificationsErrorSpy = sinon.spy(Notifications, 'error');
        collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.reject(errorResponse));
      });

      it('returns a notification error', function(done) {
        DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialog1, 'the_url', 123);
        done();
        expect(notificationsErrorSpy).to.have.been.calledWith('There was an error refreshing this dialog: oopsies');
      });
    });
  });

  describe('#setupDialogData', function() {
    var allDialogFields;
    var autoRefreshableDialogFields;

    beforeEach(function() {
      allDialogFields = [];
      autoRefreshableDialogFields = [];
    });

    describe('when the dialog field default value is blank but the values are not', function() {
      var dialogField = {name: 'dialog1', values: 'test_value', default_value: ''};
      var dialogs = [{dialog_tabs: [{dialog_groups: [{dialog_fields: [dialogField]}]}]}];

      it('pushes the dialog fields into the all dialog fields array', function() {
        DialogFieldRefresh.setupDialogData(dialogs, allDialogFields, autoRefreshableDialogFields);
        expect(allDialogFields.length).to.equal(1);
      });

      it('assigns the default value', function() {
        DialogFieldRefresh.setupDialogData(dialogs, allDialogFields, autoRefreshableDialogFields);
        expect(dialogField.default_value).to.equal('test_value');
      });

      it('sets up the triggering of auto refresh', function() {
        DialogFieldRefresh.setupDialogData(dialogs, allDialogFields, autoRefreshableDialogFields);
        expect(dialogField).to.respondTo('triggerAutoRefresh');
      });
    });

    describe('when the dialog field has an object for values', function() {
      describe('when there is no default value assigned', function() {
        var dialogField = {name: 'dialog1', values: [[1, 'one'], [2, 'two']], default_value: null};
        var dialogs = [{dialog_tabs: [{dialog_groups: [{dialog_fields: [dialogField]}]}]}];

        it('pushes the dialog field into the all dialog fields array', function() {
          DialogFieldRefresh.setupDialogData(dialogs, allDialogFields, autoRefreshableDialogFields);
          expect(allDialogFields.length).to.equal(1);
        });

        it('assigns the default value to the first value', function() {
          DialogFieldRefresh.setupDialogData(dialogs, allDialogFields, autoRefreshableDialogFields);
          expect(dialogField.default_value).to.equal(1);
        });

        it('sets up the triggering of auto refresh', function() {
          DialogFieldRefresh.setupDialogData(dialogs, allDialogFields, autoRefreshableDialogFields);
          expect(dialogField).to.respondTo('triggerAutoRefresh');
        });
      });

      describe('when there is a default value assigned', function() {
        var dialogField = {name: 'dialog1', values: [[1, 'one'], [2, 'two']], default_value: 2};
        var dialogs = [{dialog_tabs: [{dialog_groups: [{dialog_fields: [dialogField]}]}]}];

        it('pushes the dialog field into the all dialog fields array', function() {
          DialogFieldRefresh.setupDialogData(dialogs, allDialogFields, autoRefreshableDialogFields);
          expect(allDialogFields.length).to.equal(1);
        });

        it('assigns the default value', function() {
          DialogFieldRefresh.setupDialogData(dialogs, allDialogFields, autoRefreshableDialogFields);
          expect(dialogField.default_value).to.equal(2);
        });

        it('sets up the triggering of auto refresh', function() {
          DialogFieldRefresh.setupDialogData(dialogs, allDialogFields, autoRefreshableDialogFields);
          expect(dialogField).to.respondTo('triggerAutoRefresh');
        });
      });
    });

    describe('when the dialog field is auto refreshable', function() {
      var dialogField = {auto_refresh: true, name: 'dialog1'};
      var dialogs = [{dialog_tabs: [{dialog_groups: [{dialog_fields: [dialogField]}]}]}];

      it('pushes the dialog field into the all dialog fields array', function() {
        DialogFieldRefresh.setupDialogData(dialogs, allDialogFields, autoRefreshableDialogFields);
        expect(allDialogFields.length).to.equal(1);
      });

      it('sets up the triggering of auto refresh', function() {
        DialogFieldRefresh.setupDialogData(dialogs, allDialogFields, autoRefreshableDialogFields);
        expect(dialogField).to.respondTo('triggerAutoRefresh');
      });

      it('pushes the dialog field name into the auto refreshable array', function() {
        DialogFieldRefresh.setupDialogData(dialogs, allDialogFields, autoRefreshableDialogFields);
        expect(autoRefreshableDialogFields[0]).to.equal('dialog1');
      });
    });
  });

  describe('#triggerAutoRefresh', function() {
    var postMessageSpy;
    var dialogField = {};

    beforeEach(function() {
      postMessageSpy = sinon.stub(parent, 'postMessage');
      dialogField.name = 'dialogName';
    });

    afterEach(function() {
      parent.postMessage.restore();
    });

    describe('when the dialog field triggers auto refreshes', function() {
      beforeEach(function() {
        dialogField.trigger_auto_refresh = true;
      });

      it('posts a message with the field name', function() {
        DialogFieldRefresh.triggerAutoRefresh(dialogField);
        expect(postMessageSpy).to.have.been.calledWith({fieldName: 'dialogName'}, '*');
      });
    });

    describe('when the dialog field does not trigger auto refreshes', function() {
      beforeEach(function() {
        dialogField.trigger_auto_refresh = false;
      });

      it('does not post a message', function() {
        DialogFieldRefresh.triggerAutoRefresh(dialogField);
        expect(postMessageSpy).not.to.have.been.called;
      });
    });
  });
});


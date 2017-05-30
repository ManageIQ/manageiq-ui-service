describe.only('DialogFieldListener', function() {
  beforeEach(function() {
    module('app.states');
    bard.inject('DialogFieldRefresh', 'DialogFieldListener');
  });

  describe('#listenForAutoRefreshMessages', function() {
    var eventListenerSpy;
    var onListenerCallback;
    var dialogField1;
    var dialogField2;
    var refreshSingleDialogFieldSpy;

    beforeEach(function() {
      $ = sinon.stub();
      eventListenerSpy = sinon.stub({on: function() {}, off: function() {}});

      $.withArgs(document).returns(eventListenerSpy);

      refreshSingleDialogFieldSpy = sinon.stub(DialogFieldRefresh, 'refreshSingleDialogField');

      dialogField1 = {auto_refresh: true, refreshableFieldIndex: 321};
      dialogField2 = {auto_refresh: true, refreshableFieldIndex: 213};

      DialogFieldListener.listenForAutoRefreshMessages([], [dialogField1, dialogField2], 'the_url', '123');
      onListenerCallback = eventListenerSpy.on.getCall(0).args[1];
    });

    it('sets up a listener on the window', function() {
      expect(eventListenerSpy.off).to.have.been.calledWith('dialog::autoRefresh');
      expect(eventListenerSpy.on).to.have.been.calledWith('dialog::autoRefresh', onListenerCallback);
    });

    describe('listenerCallback', function() {
      var _event, data;

      beforeEach(function() {
        data = {initializingIndex: 123, currentIndex: 0};
        onListenerCallback(_event, data);
      });

      it('sets the being refreshed flag to true', function() {
        expect(dialogField2.beingRefreshed).to.equal(true);
      });

      it('sets the trigger override flag to true', function() {
        expect(dialogField2.triggerOverride).to.equal(true);
      });

      it('calls refreshSingleDialogField with the right arguments', function() {
        expect(refreshSingleDialogFieldSpy).to.have.been.calledWith([], dialogField2, 'the_url', '123', {
          initializingIndex: 123,
          currentIndex: 213
        });
      });
    });
  });
});

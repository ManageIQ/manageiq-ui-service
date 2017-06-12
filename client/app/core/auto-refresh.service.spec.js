describe('AutoRefresh Service', function() {
  beforeEach(function() {
    module('app.services');
    bard.inject('AutoRefresh');
  });

  describe('#triggerAutoRefresh', function() {
    var testFunction = sinon.stub();

    beforeEach(function() {
      AutoRefresh.callbacks.push(testFunction);
    });

    it('calls all of the callbacks passing the data through', function() {
      AutoRefresh.triggerAutoRefresh('the data');
      expect(testFunction).to.have.been.calledWith('the data');
    });
  });

  describe('#listenForAutoRefresh', function() {
    var listenerFunction;
    var refreshCallback = sinon.stub();
    var allDialogFields = 'alldialogfields';
    var url = 'url';
    var resourceId = 'resourceid';
    var dialog1 = {};
    var dialog2 = {auto_refresh: true, refreshableFieldIndex: 123};
    var autoRefreshableDialogFields = [dialog1, dialog2];

    beforeEach(function() {
      AutoRefresh.listenForAutoRefresh(allDialogFields, autoRefreshableDialogFields, url, resourceId, refreshCallback);
      listenerFunction = AutoRefresh.callbacks[0];
    });

    describe('#listenForAutoRefresh listenerFunction', function() {
      describe('when the list of fields to refresh is greater than 0', function() {
        var data = {initializingIndex: 0, currentIndex: 0};

        beforeEach(function() {
          listenerFunction(data);
        });

        it('sets the beingRefreshed property on the dialog field to true', function() {
          expect(dialog2.beingRefreshed).to.equal(true);
        });

        it('sets the triggerOverride property on the dialog field to true', function() {
          expect(dialog2.triggerOverride).to.equal(true);
        });

        it('calls the refresh callback with the right arugments', function() {
          var autoRefreshOptions = {currentIndex: 123, initializingIndex: 0};

          expect(refreshCallback).to.have.been.calledWith(
            'alldialogfields', dialog2, 'url', 'resourceid', autoRefreshOptions
          );
        });
      });
    });
  });
});

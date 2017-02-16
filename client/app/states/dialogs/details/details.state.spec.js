describe('Dialogs.details', function() {
  beforeEach(module('app.states'));

  describe('#resolveDialog', function() {
    var collectionsApiSpy;

    beforeEach(function() {
      bard.inject('$state', '$stateParams', 'CollectionsApi');

      $stateParams.dialogId = 123;
      collectionsApiSpy = sinon.spy(CollectionsApi, 'get');
    });

    it('should query the API with the correct dialog id and options', function() {
      var options = {};
      $state.get('dialogs.details').resolve.dialog($stateParams, CollectionsApi);
      expect(collectionsApiSpy).to.have.been.calledWith('service_dialogs', 123, options);
    });
  });
});

/* jshint -W117, -W030 */
describe('Dialogs.details', function() {
  beforeEach(function() {
    module('app.states', 'app.config', 'gettext', bard.fakeToastr);
  });

  describe('#resolveDialog', function() {
    var collectionsApiSpy;

    beforeEach(function() {
      bard.inject('$state', '$stateParams', 'CollectionsApi');

      $stateParams.dialogId = 123;
      collectionsApiSpy = sinon.spy(CollectionsApi, 'get');
    });

    xit('should query the API with the correct dialog id and options', function() {
      var options = {};
      $state.get('dialogs.details').resolve.dialog($stateParams, CollectionsApi);
      expect(collectionsApiSpy).to.have.been.calledWith('service_dialogs', 123, options);
    });
  });
});

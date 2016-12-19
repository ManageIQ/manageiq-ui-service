describe('app.components.process-requests-modal', function() {
  beforeEach(function () {
    module('app.components', 'app.services', 'app.config', 'gettext' );
  });

  describe('factory', function () {

    beforeEach(function () {
      bard.inject('ProcessRequestsModal', 'CollectionsApi');
    });

    it('should be defined', function () {
      var modalType = 'approve';
      var requests = [{id:100, approval_state: 'pending_approval'},{id:200, approval_state: 'pending_approval'}];
      var modal = ProcessRequestsModal.showModal(requests, modalType);
      expect(modal).to.be.defined;
    });
  });
});

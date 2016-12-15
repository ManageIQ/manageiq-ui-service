describe('app.components.SaveModalDialog', function() {
  beforeEach(function () {
    module('app.components', 'ui.bootstrap', 'gettext');
  });

  describe('service', function () {
    var callbackObject;
    var saveSpy;
    var doNotSaveSpy;
    var cancelSpy;

    beforeEach(function () {
      bard.inject('SaveModalDialog', '$rootScope', '$document', '$timeout');

      callbackObject = {
        save: function () {},
        doNotSave: function () {},
        cancel: function () {},
      }
      saveSpy = sinon.spy(callbackObject, "save");
      doNotSaveSpy = sinon.spy(callbackObject, "doNotSave");
      cancelSpy = sinon.spy(callbackObject, "cancel");
    });

    it('should show the modal', function () {
      var modal = SaveModalDialog.showModal(callbackObject.save, callbackObject.doNotSave, callbackObject.cancel, true);
      $rootScope.$digest();

      var saveDialog = $document.find('.save-modal-dialog');
      expect(saveDialog.length).to.eq(1);
    });

    xit('should show a save button when it is OK to save', function () {

      var modal = SaveModalDialog.showModal(callbackObject.save, callbackObject.doNotSave, callbackObject.cancel, true);
      $rootScope.$digest();

      var saveButton = $document.find('.save-modal-dialog .btn.btn-primary');
      expect(saveButton.length).to.eq(2);  // Buttons are cumulative since prior test modal cannot be closed

      eventFire(saveButton[1], 'click');

      $rootScope.$digest();
      expect(saveSpy).to.have.been.called;

      var closeButtons = $document.find('.save-modal-dialog .btn.btn-default');
      expect(closeButtons.length).to.eq(4); // Buttons are cumulative since prior test modal cannot be closed

      eventFire(closeButtons[2], 'click');

      $rootScope.$digest();
      expect(cancelSpy).to.have.been.called;

      eventFire(closeButtons[3], 'click');

      $rootScope.$digest();
      expect(doNotSaveSpy).to.have.been.called;
    });

    xit('should not show a save button when it is not OK to save', function () {

      var modal = SaveModalDialog.showModal(callbackObject.save, callbackObject.doNotSave, callbackObject.cancel, false);
      $rootScope.$digest();

      var saveButton = $document.find('.save-modal-dialog .btn.btn-primary');
      expect(saveButton.length).to.eq(2); // Buttons are cumulative since prior test modal cannot be closed
    });
  });
});

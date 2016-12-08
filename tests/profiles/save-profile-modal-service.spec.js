describe('app.components.SaveProfileModal', function() {
  beforeEach(function () {
    module('app.components', 'ui.bootstrap', 'gettext');
  });

  describe('service', function () {
    var callbackObject;
    var saveSpy;
    var doNotSaveSpy;
    var cancelSpy;

    beforeEach(function () {
      bard.inject('SaveProfileModal', '$rootScope', '$document');

      callbackObject = {
        save: function () {},
        doNotSave: function () {},
        cancel: function () {},
      }
      saveSpy = sinon.spy(callbackObject, "save");
      doNotSaveSpy = sinon.spy(callbackObject, "doNotSave");
      cancelSpy = sinon.spy(callbackObject, "cancel");
    });

    xit('should show the modal', function () {
      var modal = SaveProfileModal.showModal(callbackObject.save, callbackObject.doNotSave, callbackObject.cancel);
      $rootScope.$digest();

      var saveDialog = $document.find('.save-profile-modal');
      expect(saveDialog.length).to.eq(1);

      var saveButton = $document.find('.save-profile-modal .btn.btn-primary');
      expect(saveButton.length).to.eq(1);

      eventFire(saveButton[0], 'click');

      $rootScope.$digest();
      expect(saveSpy).to.have.been.called;

      var closeButtons = $document.find('.save-profile-modal .btn.btn-default');
      expect(closeButtons.length).to.eq(2);

      eventFire(closeButtons[0], 'click');

      $rootScope.$digest();
      expect(cancelSpy).to.have.been.called;

      eventFire(closeButtons[1], 'click');

      $rootScope.$digest();
      expect(doNotSaveSpy).to.have.been.called;
    });
  });
});

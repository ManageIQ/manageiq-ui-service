/* global $document, eventFire, SaveModalDialog */
/* eslint-disable no-unused-expressions */
describe('Component: SaveModalDialog', () => {
  beforeEach(module('app.components'))

  describe('service', () => {
    let callbackObject, saveSpy, doNotSaveSpy, cancelSpy

    beforeEach(() => {
      bard.inject('SaveModalDialog', '$document')

      callbackObject = {
        save: () => {},
        doNotSave: () => {},
        cancel: () => {}
      }
      saveSpy = sinon.spy(callbackObject, 'save')
      doNotSaveSpy = sinon.spy(callbackObject, 'doNotSave')
      cancelSpy = sinon.spy(callbackObject, 'cancel')
    })

    it('should show the modal', (done) => {
      SaveModalDialog.showModal(callbackObject.save, callbackObject.doNotSave, callbackObject.cancel, true)
      done()

      const saveDialog = $document.find('.save-modal-dialog')
      expect(saveDialog.length).to.eq(1)
    })

    it('should show a save button when it is OK to save', (done) => {
      SaveModalDialog.showModal(callbackObject.save, callbackObject.doNotSave, callbackObject.cancel, true)
      done()

      const saveButton = $document.find('.save-modal-dialog .btn.btn-primary')
      expect(saveButton.length).to.eq(2)  // Buttons are cumulative since prior test modal cannot be closed

      eventFire(saveButton[1], 'click')
      expect(saveSpy).to.have.been.called

      const closeButtons = $document.find('.save-modal-dialog .btn.btn-default')
      expect(closeButtons.length).to.eq(4) // Buttons are cumulative since prior test modal cannot be closed

      eventFire(closeButtons[2], 'click')
      expect(cancelSpy).to.have.been.called

      eventFire(closeButtons[3], 'click')
      expect(doNotSaveSpy).to.have.been.called
    })

    it('should not show a save button when it is not OK to save', (done) => {
      SaveModalDialog.showModal(callbackObject.save, callbackObject.doNotSave, callbackObject.cancel, false)
      done()

      const saveButton = $document.find('.save-modal-dialog .btn.btn-primary')
      expect(saveButton.length).to.eq(2) // Buttons are cumulative since prior test modal cannot be closed
    })
  })
})

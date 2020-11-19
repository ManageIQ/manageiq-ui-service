/* global $componentController, Language */
/* eslint-disable no-unused-expressions */
describe('Component: languageSwitcher ', function () {
  let ctrl
  let languageSpy

  describe('Language switch select list', () => {
    beforeEach(function () {
      module('app.core', 'app.shared')
      bard.inject('$componentController', 'Language')

      ctrl = $componentController('languageSwitcher', {}, {
        'mode': 'select'
      })
      languageSpy = sinon.stub(Language, 'ready').returns((Promise.resolve([])))
    })

    it('is defined', function () {
      expect(ctrl).to.exist;
    })

    it('allows for the component to initialize', (done) => {
      ctrl.$onInit()
      done()
      expect(languageSpy).to.have.been.called
    })

    it('allows for a language to be set via login select menu', (done) => {
      languageSpy = sinon.stub(Language, 'setLoginLanguage').returns(true)
      ctrl.switchLanguage('fr')
      done()
      expect(languageSpy).to.have.been.calledWith('fr')
    })
  })
  describe('Language switch Menu', () => {
    beforeEach(function () {
      module('app.core', 'app.shared')
      bard.inject('$componentController', 'Language')

      ctrl = $componentController('languageSwitcher', {}, {
        'mode': 'menu'
      })
      languageSpy = sinon.stub(Language, 'ready').returns((Promise.resolve([])))
    })

    it('allows for a language to be changed via menu', (done) => {
      languageSpy = sinon.stub(Language, 'save').returns((Promise.resolve('success')))
      ctrl.switchLanguage('fr')
      done()
      expect(languageSpy).to.have.been.calledWith('fa')
    })
  })
})

describe('app.services.Language', function() {
  beforeEach(function() {
    module('app.states', 'app.services', bard.fakeToastr);
    bard.inject('Language');
  });

  describe('#match', function() {
    it('matches short available with long accepted', function() {
      var available = {'ja': '', 'en': '', 'fr': ''};
      var accepted = ['fr-FR', 'en'];
      expect(Language.match(available, accepted)).to.eq('fr');
    });

    it('matches long available with short accepted', function() {
      var available = {'ja-JP': '', 'en': '', 'fr-FR': ''};
      var accepted = ['fr', 'en'];
      expect(Language.match(available, accepted)).to.eq('fr-FR');
    });
  });
});

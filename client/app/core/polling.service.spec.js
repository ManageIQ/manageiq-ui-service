describe('Polling Service', () => {
beforeEach(function() {
    module('app.shared');
    bard.inject('Polling');
    Polling.start('test', function(){console.log('hello world')},1500);
});
    it('should allow for polling to be created', () => {
        const polls = Polling.getPolls();
        expect(polls).to.have.property('test');
    });
    it('should allow you to stop all polls', () => {
        Polling.stopAll();
        const polls = Polling.getPolls();
        expect(polls).to.be.empty;
    });
}); 

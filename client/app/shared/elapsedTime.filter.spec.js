describe("Filter: elapsedTimeFilter", function() {
    let elapsedTimeFilter;

    // load the module
    beforeEach(module('app.shared'));

    // load filter function into variable
    beforeEach(inject(function ($filter) {
        elapsedTimeFilter = $filter('elapsedTime');
    }));

    it('should exist when invoked', function () {
        expect(elapsedTimeFilter).to.be.define;
    });

    it('should correctly display valid time format', function () {
        expect(elapsedTimeFilter(120000)).to.be.eq("33 hours 20 min 00 sec");
    });

    it('should correctly display invalid time format', function () {
        expect(elapsedTimeFilter()).to.be.eq("00:00:00");
    });
});

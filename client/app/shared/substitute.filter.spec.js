describe("Filter: substitute", function() {
    let substituteFilter;

    // load the module
    beforeEach(module('app.shared'));

    // load filter function into variable
    beforeEach(inject(function ($filter) {
        substituteFilter = $filter('substitute');
    }));

    it('should exist when invoked', function () {
        expect(substituteFilter).to.be.define;
    });

    it('should correctly display valid format', function () {
        expect(substituteFilter('Clear All [[heading]]', {heading: 'Notifications'})).to.be.eq("Clear All Notifications");
    });
});



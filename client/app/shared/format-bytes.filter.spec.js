describe("Filter: format-bytes", function() {
    let formatBytesFilter;

    // load the module
    beforeEach(module('app.shared'));

    // load filter function into variable
    beforeEach(inject(function ($filter) {
        formatBytesFilter = $filter('formatBytes');
    }));

    it('should exist when invoked', function () {
        expect(formatBytesFilter).to.be.define;
    });

    it('should correctly display valid format', function () {
        expect(formatBytesFilter(2048)).to.be.eq("2 kB");
    });

    it('should correctly display valid format', function () {
        expect(formatBytesFilter(42424242424242)).to.be.eq("38.6 TB");
    });

    it('should correctly display invalid format', function () {
        expect(formatBytesFilter(0)).to.be.eq("0 Bytes");
    });
});

describe('Component: reportsExplorer', function() {
  beforeEach(function() {
    browser.get('/reports');
  });
  it('should have correct breadcrumb for Reports', function() {
    const breadcrumb = element.all(by.css('.breadcrumb > .active'));
    expect(breadcrumb.get(0).getText()).toBe("Reports");
  });
  it('should have expected number of results', function() {
    const results = element.all(by.css('.toolbar-pf-results h5'));
    expect(results.get(0).getText()).toBe("5 Results");
  });
  it('should have expected number of rows', function() {
    const list = element.all(by.css('.list-view-container .card-view-pf .card'));
    expect(list.count()).toBe(5);
  });
});

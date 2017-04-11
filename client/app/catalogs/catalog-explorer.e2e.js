describe('Component: catalogExplorer', function() {
  beforeEach(function() {
    browser.get('/catalogs');
  });
  it('should have correct breadcrumb', function() {
    const breadcrumb = element.all(by.css('.breadcrumb > .active'));
    expect(breadcrumb.get(0).getText()).toBe("Service Catalogs");
  });
  it('should have expected number of results', function() {
    const results = element.all(by.css('.toolbar-pf-results h5'));
    expect(results.get(0).getText()).toBe("10 Results");
  });
  it('should have expected number of rows', function() {
    const list = element.all(by.css('.list-view-container .card-view-pf .card'));
    expect(list.count()).toBe(23);
  });
});

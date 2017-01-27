describe('Component: catalogExplorer', function() {
  beforeEach(function() {
    browser.sleep(10000);
    browser.get('/catalogs');
  });
  it('should have correct breadcrumb', function() {
    const breadcrumb = element.all(by.css('.breadcrumb > .active'));
    expect(breadcrumb.get(0).getInnerHtml()).toBe("Catalogs");
  });
  it('should have expected number of results', function() {
    let results = element.all(by.css('.toolbar-pf-results h5'));
    expect(results.get(0).getInnerHtml()).toBe("10 Results");
  });
});

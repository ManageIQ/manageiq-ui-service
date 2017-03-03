describe('Component: templateExplorer', function () {
  beforeEach(function () {
    browser.get('/templates');
  });
  it('should have correct breadcrumb', function () {
    var breadcrumb = element.all(by.css('.breadcrumb > .active'));
    expect(breadcrumb.get(0).getText()).toBe("Templates");
  });
  it('should have expected number of results', function () {
    const results = element.all(by.css('.toolbar-pf-results h5'));
    expect(results.get(0).getText()).toBe("2 Results");
  });
  it('should have expected number of rows', function () {
    const list = element.all(by.css('.list-view-container .list-group .list-group-item'));
    expect(list.count()).toBe(2);
  });
});

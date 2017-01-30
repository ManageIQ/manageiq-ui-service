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
    const results = element.all(by.css('.toolbar-pf-results h5'));
    expect(results.get(0).getInnerHtml()).toBe("10 Results");
  });
  it('should have expected number of rows', function() {
    const list = element.all(by.css('.list-view-container .list-group .list-group-item'));
    expect(list.count()).toBe(10);
  });
  it('should, after successful delete, have expected number of rows ', function() {
    element.all(by.id('dropdownKebabRight_0')).click();
    element.all(by.css('div#kebab_0 ul li:nth-child(2) a')).click();
    element.all(by.css('div.confirmation__buttons button:nth-child(2)')).click();

  });
});

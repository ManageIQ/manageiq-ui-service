describe('Component: orderExplorer', function() {
  beforeEach(function() {
    browser.sleep(10000);
    browser.get('/orders');
  });
  it('should have correct breadcrumb', function() {
    var breadcrumb = element.all(by.css('.breadcrumb > .active'));
    expect(breadcrumb.get(0).getText()).toBe("Orders");
  });
});

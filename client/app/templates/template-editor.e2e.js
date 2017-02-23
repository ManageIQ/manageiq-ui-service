describe('Component: templateEditor', function () {
  beforeEach(function () {
    browser.sleep(10000);
    browser.get('/templates/edit/');
  });
  it('should have correct breadcrumb', function () {
    var breadcrumb = element.all(by.css('.breadcrumb > .active'));
    expect(breadcrumb.get(0).getText()).toBe("Add Template");
  });
});

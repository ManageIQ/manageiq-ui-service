describe('Component: templateEditor', function () {
  beforeEach(function () {
    browser.sleep(10000);
    browser.get('/templates/edit/10000000000124');
  });
  it('should have correct breadcrumb', function () {
    var breadcrumb = element.all(by.css('.breadcrumb > .active'));
    expect(breadcrumb.get(0).getText()).toBe("Edit Template");
  });
  it('should have a name', function () {
    var name = element.all(by.id('template-editor-name')).first();
    expect(name.getAttribute('value')).toBe("101-vm-simple-rhel");
  });
});

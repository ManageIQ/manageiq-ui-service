describe('Component: snapshots', function() {
  // it('should be accessible when a vm has snapshots', function() {
  //   browser.get('/services/10000000000527');
  //   browser.sleep(10000);
  //   element.all(by.css('.list-view-pf-actions .dropdown-kebab-pf button')).click();
  //   const viewSnapshot = element.all(by.css('.dropdown-menu-appended-to-body li:nth-child(6) a'));
  //   expect(viewSnapshot.get(0).getText()).toBe("View Snapshots");
  // }, 1200000);

  it('should be inaccessible when a vm does not have snapshots', function() {
    browser.get('/services/10000000000405');
    browser.sleep(10000);
    element.all(by.css('.list-view-pf-actions .dropdown-kebab-pf button')).click();

    expect(element.all(by.css('.dropdown-menu-appended-to-body li:nth-child(6) a')).isPresent()).toBe(false);

    const breadcrumb = element.all(by.css('.breadcrumb > .active'));
    expect(breadcrumb.get(0).getText()).toBe("alaurent23");
  }, 120000);

  it('should list two snapshots', function() {
    browser.get('vms/10000000001447/snapshots');
    browser.sleep(10000);

    const list = element.all(by.css('.list-view-container .list-group .list-group-item'));
    expect(list.count()).toBe(2);
  }, 120000);
});

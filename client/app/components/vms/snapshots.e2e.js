describe('Component: snapshots', function() {
  beforeEach(function() {
    browser.sleep(10000);
  });

  it('should be accessible when a vm has snapshots', function() {
    browser.get('/services/10000000000527');
    browser.sleep(20000);
    viewSnapshotsDetails();

    const breadcrumb = element.all(by.css('.breadcrumb > .active'));
    expect(breadcrumb.get(0).getText()).toBe("Snapshots");
  });

  it('should be inaccessible when a vm does not have snapshots', function() {
    browser.get('/services/10000000000405');
    browser.sleep(10000);
    viewSnapshotsDetails();

    const breadcrumb = element.all(by.css('.breadcrumb > .active'));
    expect(breadcrumb.get(0).getText()).toBe("alaurent23");
  });

  it('should be list two snapshots', function() {
    browser.get('/services/10000000000527');
    browser.sleep(20000);
    viewSnapshotsDetails();

    const list = element.all(by.css('.list-view-container .list-group .list-group-item'));
    expect(list.count()).toBe(2);
  });
});

// Helpers
function viewSnapshotsDetails() {
  element.all(by.css('.list-view-pf-actions .dropdown-kebab-pf button')).click();
  element.all(by.css('.dropdown-menu-appended-to-body li:nth-child(6) a')).click();
}

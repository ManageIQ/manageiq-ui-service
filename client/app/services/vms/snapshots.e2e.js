describe('Component: snapshots', function() {
  it('should list two snapshots', function() {
    browser.get('vms/10000000001447/snapshots');

    const list = element.all(by.css('.list-view-container .list-group .list-group-item'));
    expect(list.count()).toBe(2);
  }, 120000);
});

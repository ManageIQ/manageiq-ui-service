describe('dashboard', function() {
  beforeEach(function () {
    browser.get(browser.baseUrl);
  });
  it('should have two counters up top', function() {
    var list = element.all(by.css('.ss-dashboard__card-primary__count'));
    expect(list.count()).toBe(2);
  });

  it('should have counters have a very specific non zero numnber', function() {
    var counters = element.all(by.css('.ss-dashboard__card-primary__count h2'));
    expect(counters.get(0).getText()).toBeGreaterThan(0);
  });
});

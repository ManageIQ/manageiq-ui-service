describe('Component: pagination', function() {
  it('should correctly respond to a change in limit', function() {
    browser.get('/services');
    element.all(by.css('.pagination-footer button')).click();
    element.all(by.css('.pagination-footer ul.dropdown-menu li:nth-child(1) a')).click();

    const limit = element.all(by.css('.pagination-footer .dropup button'));
    expect(limit.get(0).getText()).toBe("5 items");
  }, 1200000);

  it('should successfully page forward', function() {
    browser.get('/catalogs');
    changeLimit();

    const limit = element.all(by.css('.pagination-footer .pagination-controls'));
    expect(limit.get(0).getText()).toBe("1 - 5 of 10");

    pageNext();
    const updatedIndex = element.all(by.css('.pagination-footer .pagination-controls li:nth-child(3) span'));
    expect(updatedIndex.get(0).getText()).toBe("6 - 10 of 10");
  }, 1200000);

  it('should successfully page backward', function() {
    browser.get('/catalogs');
    changeLimit();

    const limit = element.all(by.css('.pagination-footer .pagination-controls'));
    expect(limit.get(0).getText()).toBe("1 - 5 of 10");

    pageNext();
    const updatedIndex = element.all(by.css('.pagination-footer .pagination-controls li:nth-child(3) span'));
    expect(updatedIndex.get(0).getText()).toBe("6 - 10 of 10");

    element.all(by.css('.pagination-footer .pagination-controls ul.pagination span[alt="Previous"]')).click();
    const previousIndex = element.all(by.css('.pagination-footer .pagination-controls li:nth-child(3) span'));
    expect(previousIndex.get(0).getText()).toBe("1 - 5 of 10");
  }, 1200000);
});

// Helpers
function changeLimit() {
  element.all(by.css('.pagination-footer button')).click();
  element.all(by.css('.pagination-footer ul.dropdown-menu li:nth-child(1) a')).click();
}

function pageNext() {
  element.all(by.css('.pagination-footer .pagination-controls ul.pagination span[alt="Next"]')).click();
}

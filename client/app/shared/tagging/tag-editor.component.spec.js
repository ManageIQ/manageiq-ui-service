describe('TagEditor component', () => {
  const tagListSpy = componentSpyOn('tagList');
  let parentScope, element;

  beforeEach(module('app.shared', tagListSpy));

  beforeEach(inject(($compile, $rootScope) => {
    parentScope = $rootScope.$new();
    parentScope.tags = [
      { categorization: { displayName: 'Location: Chicago' } },
      { categorization: { displayName: 'Service Level: Gold' } },
    ];

    element = angular.element(`
      <tag-editor tags-of-item="tags"></tag-editor>
    `);
    $compile(element)(parentScope);
    parentScope.$digest();
  }));

  it('passes tags down to the tag-list component', () => {
    const tagListTags = tagListSpy.bindings[0].tags;

    expect(tagListTags).to.eq(parentScope.tags);
  });

  it('loads all tags and tag categories on init', () => {
    // expect(isoScope.vm.tags.all).to.eq(scope.allTags.resources);
    // expect(isoScope.vm.showTagDropdowns).to.eq(true);
    //
    // expect(collectionsApiSpy).to.have.been.calledWith('categories', options);
    // expect(collectionsApiSpy).to.have.been.calledWith('tags', options2);
    //
    // let tagCategorySelect = element.find(".tag-category-select");
    // let tagCategories = angular.element(tagCategorySelect).find("option");
    // expect(tagCategories.length).to.be.eq(28);
  });

  it('should default to first tag category, and tags of that category', function() {
    // isoScope.$digest();
    // let tagCategorySelect = element.find(".tag-category-select");
    // let tagCategories = angular.element(tagCategorySelect).find("option");
    // expect(tagCategories[0].text).to.be.eq("Auto Approve - Max CPU");
    // expect(tagCategories[0].selected).to.be.eq(true);
    //
    // let tagsOfCategorySelect = element.find(".tag-value-select");
    // let tagsOfCategory = angular.element(tagsOfCategorySelect).find("option");
    // expect(tagsOfCategory.length).to.be.eq(6);    // 6 Auto Approve options
    // expect(tagsOfCategory[0].selected).to.be.eq(true);
  });

  it('should add a tag', function() {
    // isoScope.vm.tags.selectedCategory = isoScope.vm.tags.categories[8];
    // isoScope.$digest();
    // isoScope.vm.tags.selectedTag = isoScope.vm.tags.filtered[1];
    // isoScope.$digest();
    //
    // expect(isoScope.vm.tags.selectedTag.name).to.be.eq("/managed/department/accounting");
    //
    // let tagCategorySelect = element.find(".tag-category-select");
    // let tagCategories = angular.element(tagCategorySelect).find("option");
    // expect(tagCategories[8].text).to.be.eq("Department");
    // expect(tagCategories[8].selected).to.be.eq(true);
    //
    // let tagsOfCategorySelect = element.find(".tag-value-select");
    // let tagsOfCategory = angular.element(tagsOfCategorySelect).find("option");
    // expect(tagsOfCategory[1].text).to.be.eq("Accounting");
    // expect(tagsOfCategory[1].selected).to.be.eq(true);
    //
    // // should be 2 existing tags
    // let tagsOfItem = element.find(".pficon-close");
    // expect(tagsOfItem.length).to.be.eq(2);
    //
    // let addItem = element.find(".fa-plus");
    // expect(addItem.length).to.be.eq(1);
    // addItem[0].click();
    // isoScope.$digest();
    //
    // // should now have three tags
    // tagsOfItem = element.find(".pficon-close");
    // expect(tagsOfItem.length).to.be.eq(3);
  });

  it('should replace single-value tags', function() {
    // // There is an existing 'single-value' tag
    // let tagsOfItem = element.find(".pficon-close");
    // expect(tagsOfItem.length).to.be.eq(2);
    // expect(angular.element(tagsOfItem[1]).parent().parent().text().trim()).to.be.eq("Service Level: Gold");
    //
    // // Select tag category 'Service Level' and tag 'Platinum'
    // isoScope.vm.tags.selectedCategory = isoScope.vm.tags.categories[24];
    // isoScope.$digest();
    // isoScope.vm.tags.selectedTag = isoScope.vm.tags.filtered[3];
    // isoScope.$digest();
    //
    // expect(isoScope.vm.tags.selectedTag.name).to.be.eq("/managed/service_level/platinum");
    //
    // let tagCategorySelect = element.find(".tag-category-select");
    // let tagCategories = angular.element(tagCategorySelect).find("option");
    // expect(tagCategories[24].text).to.be.eq("Service Level");
    // expect(tagCategories[24].selected).to.be.eq(true);
    //
    // let tagsOfCategorySelect = element.find(".tag-value-select");
    // let tagsOfCategory = angular.element(tagsOfCategorySelect).find("option");
    // expect(tagsOfCategory[3].text).to.be.eq("Platinum");
    // expect(tagsOfCategory[3].selected).to.be.eq(true);
    //
    // // This should replace Service Level Gold with Service Level Platinum
    // let addItem = element.find(".fa-plus");
    // expect(addItem.length).to.be.eq(1);
    // addItem[0].click();
    //
    // isoScope.$digest();
    //
    // // Second Tag should now be Service Level: Platinum
    // tagsOfItem = element.find(".pficon-close");
    // expect(tagsOfItem.length).to.be.eq(2);
    // expect(angular.element(tagsOfItem[1]).parent().parent().text().trim()).to.be.eq("Service Level: Platinum");
  });
});

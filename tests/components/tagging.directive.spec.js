describe('app.components.taggingWidget directive', function() {
  var $scope;
  var $compile;
  var element;
  var collectionsApiSpy;
  var isoScope;
  var options = {
    expand: 'resources',
  };

  var attributes = ['categorization', 'category.id', 'category.single_value'];
  var options2 = {
    expand: 'resources',
    attributes: attributes,
  };

  beforeEach(function () {
    module('app.components', 'app.services', 'app.config', 'app.states', 'gettext');
    bard.inject('$state', 'Session', '$httpBackend', 'CollectionsApi', '$timeout');
  });

  beforeEach(inject(function (_$compile_, _$rootScope_, _$document_) {
    $compile = _$compile_;
    $scope = _$rootScope_;
    $document = _$document_;
  }));

  var compileHTML = function (markup, scope) {
    element = angular.element(markup);
    var el = $compile(element)(scope);
    scope.$digest();
    isoScope = el.isolateScope();
    isoScope.vm.loadAllCategories();  //this chained promise isn't being called -call manually
  };

  beforeEach(function () {
    Session.create({
      auth_token: 'b10ee568ac7b5d4efbc09a6b62cb99b8',
    });
    $httpBackend.whenGET('').respond(200);

    var mockDir = 'tests/mock/blueprint-details/';
    $scope.tagsOfBlueprint = readJSON(mockDir + 'tags-of-blueprint.json');
    $scope.allTags = readJSON(mockDir + 'all-tags.json');
    $scope.tagCategories = readJSON(mockDir + 'tag-categories.json');

    collectionsApiSpy = sinon.stub(CollectionsApi, 'query');
    collectionsApiSpy.withArgs('categories', options).returns(Promise.resolve($scope.tagCategories));
    collectionsApiSpy.withArgs('tags', options2).returns(Promise.resolve($scope.allTags));

    var htmlTmp = '<tagging-widget tags-of-item="tagsOfBlueprint"/>';

    compileHTML(htmlTmp, $scope);
  });

  describe('Tagging Widget', function() {

    it('should have correct number of existing tags', function () {
      var tagsOfItem = element.find(".pficon-close");
      expect(tagsOfItem.length).to.be.eq(2);
    });

    it('should have correct number of tags and tag categories', function (done) {
      // wait till promises and watchers resolve
      setTimeout(function() {
        isoScope.$digest();
        expect(isoScope.vm.tags.all).to.eq($scope.allTags.resources);
        expect(isoScope.vm.tags.categories).to.eq($scope.tagCategories.resources);
        expect(isoScope.vm.showTagDropdowns).to.eq(true);

        expect(collectionsApiSpy).to.have.been.calledWith('categories',options);
        expect(collectionsApiSpy).to.have.been.calledWith('tags',options2);

        var tagCategorySelect = element.find(".tag-category-select");
        var tagCategories = angular.element(tagCategorySelect).find("option");
        expect(tagCategories.length).to.be.eq(28);

        done();
      }, 500);
    });

    it('should default to first tag category, and tags of that category', function (done) {
      setTimeout(function() {
        isoScope.$digest();
        var tagCategorySelect = element.find(".tag-category-select");
        var tagCategories = angular.element(tagCategorySelect).find("option");
        expect(tagCategories[0].text).to.be.eq("Location");
        expect(tagCategories[0].selected).to.be.eq(true);

        var tagsOfCategorySelect = element.find(".tag-value-select");
        var tagsOfCategory = angular.element(tagsOfCategorySelect).find("option");
        expect(tagsOfCategory.length).to.be.eq(5);    // 5 Location options
        expect(tagsOfCategory[0].selected).to.be.eq(true);

        done();
      }, 500);
    });

    it('should add a tag', function (done) {
      setTimeout(function() {
        // Select tag category 'Department' and tag 'Accounting'
        isoScope.vm.tags.selectedCategory = isoScope.vm.tags.categories[8];
        isoScope.$digest();
        isoScope.vm.tags.selectedTag = isoScope.vm.tags.filtered[1];
        isoScope.$digest();

        expect(isoScope.vm.tags.selectedTag.name).to.be.eq("/managed/department/accounting");

        var tagCategorySelect = element.find(".tag-category-select");
        var tagCategories = angular.element(tagCategorySelect).find("option");
        expect(tagCategories[8].text).to.be.eq("Department");
        expect(tagCategories[8].selected).to.be.eq(true);

        var tagsOfCategorySelect = element.find(".tag-value-select");
        var tagsOfCategory = angular.element(tagsOfCategorySelect).find("option");
        expect(tagsOfCategory[1].text).to.be.eq("Accounting");
        expect(tagsOfCategory[1].selected).to.be.eq(true);

        // should be 2 existing tags
        var tagsOfItem = element.find(".pficon-close");
        expect(tagsOfItem.length).to.be.eq(2);

        var addItem = element.find(".fa-plus");
        expect(addItem.length).to.be.eq(1);
        addItem[0].click();
        isoScope.$digest();

        // should now have three tags
        tagsOfItem = element.find(".pficon-close");
        expect(tagsOfItem.length).to.be.eq(3);

        done();
      }, 500);
    });

    it('should replace single-value tags', function (done) {
      setTimeout(function() {
        // There is an existing 'single-value' tag
        var tagsOfItem = element.find(".pficon-close");
        expect(tagsOfItem.length).to.be.eq(2);
        expect(angular.element(tagsOfItem[1]).parent().parent().text()).to.be.eq("Service Level: Gold ");

        // Select tag category 'Service Level' and tag 'Platinum'
        isoScope.vm.tags.selectedCategory = isoScope.vm.tags.categories[5];
        isoScope.$digest();
        isoScope.vm.tags.selectedTag = isoScope.vm.tags.filtered[3];
        isoScope.$digest();

        expect(isoScope.vm.tags.selectedTag.name).to.be.eq("/managed/service_level/platinum");

        var tagCategorySelect = element.find(".tag-category-select");
        var tagCategories = angular.element(tagCategorySelect).find("option");
        expect(tagCategories[5].text).to.be.eq("Service Level");
        expect(tagCategories[5].selected).to.be.eq(true);

        var tagsOfCategorySelect = element.find(".tag-value-select");
        var tagsOfCategory = angular.element(tagsOfCategorySelect).find("option");
        expect(tagsOfCategory[3].text).to.be.eq("Platinum");
        expect(tagsOfCategory[3].selected).to.be.eq(true);

        // This should replace Service Level Gold with Service Level Platinum
        var addItem = element.find(".fa-plus");
        expect(addItem.length).to.be.eq(1);
        addItem[0].click();

        isoScope.$digest();

        // Second Tag should now be Service Level: Platinum
        tagsOfItem = element.find(".pficon-close");
        expect(tagsOfItem.length).to.be.eq(2);
        expect(angular.element(tagsOfItem[1]).parent().parent().text()).to.be.eq("Service Level: Platinum ");

        done();
      }, 500);
    });

    it('should remove a tag', function (done) {
      setTimeout(function() {
        var tagsOfItem = element.find(".pficon-close");
        expect(tagsOfItem.length).to.be.eq(2);

        tagsOfItem[1].click();
        isoScope.$digest();

        tagsOfItem = element.find(".pficon-close");
        expect(tagsOfItem.length).to.be.eq(1);

        done();
      }, 500);
    });
  });
});

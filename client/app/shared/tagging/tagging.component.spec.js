/* global inject, $httpBackend, readJSON, CollectionsApi */
/* eslint-disable no-unused-expressions, angular/timeout-service */
describe('Component: taggingWidget', () => {
  beforeEach(() => {
    module('app.components')
    bard.inject('$httpBackend', 'CollectionsApi')
  })

  describe('with $compile', () => {
    let scope
    let element
    let collectionsApiSpy
    let isoScope
    let options = {
      expand: 'resources'
    }

    let attributes = ['categorization', 'category.id', 'category.single_value']
    let options2 = {
      expand: 'resources',
      attributes: attributes
    }

    beforeEach(inject(($compile, $rootScope) => {
      let mockDir = 'tests/mock/blueprint-details/'

      scope = $rootScope.$new()

      $httpBackend.whenGET('').respond(200)

      scope.tagsOfBlueprint = readJSON(mockDir + 'tags-of-blueprint.json')
      scope.allTags = readJSON(mockDir + 'all-tags.json')
      scope.tagCategories = readJSON(mockDir + 'tag-categories.json')

      collectionsApiSpy = sinon.stub(CollectionsApi, 'query')
      collectionsApiSpy.withArgs('categories', options).returns(Promise.resolve(scope.tagCategories))
      collectionsApiSpy.withArgs('tags', options2).returns(Promise.resolve(scope.allTags))

      element = angular.element('<tagging-widget tags-of-item="tagsOfBlueprint"/>')
      let el = $compile(element)(scope)
      scope.$digest()
      isoScope = el.isolateScope()
      isoScope.vm.loadAllCategories()  // this chained promise isn't being called -call manually
    }))

    it('should have correct number of existing tags', () => {
      let tagsOfItem = element.find('.pficon-close')
      expect(tagsOfItem.length).to.be.eq(2)
    })

    it('should have correct number of tags and tag categories', (done) => {
      // wait till promises and watchers resolve
      setTimeout(() => {
        isoScope.$digest()
        expect(isoScope.vm.tags.all).to.eq(scope.allTags.resources)
        expect(isoScope.vm.showTagDropdowns).to.eq(true)

        expect(collectionsApiSpy).to.have.been.calledWith('categories', options)
        expect(collectionsApiSpy).to.have.been.calledWith('tags', options2)

        let tagCategorySelect = element.find('.tag-category-select')
        let tagCategories = angular.element(tagCategorySelect).find('option')
        expect(tagCategories.length).to.be.eq(28)

        done()
      }, 500)
    })

    it('should default to first tag category, and tags of that category', (done) => {
      setTimeout(() => {
        isoScope.$digest()
        let tagCategorySelect = element.find('.tag-category-select')
        let tagCategories = angular.element(tagCategorySelect).find('option')
        expect(tagCategories[0].text).to.be.eq('Auto Approve - Max CPU')
        expect(tagCategories[0].selected).to.be.eq(true)

        let tagsOfCategorySelect = element.find('.tag-value-select')
        let tagsOfCategory = angular.element(tagsOfCategorySelect).find('option')
        expect(tagsOfCategory.length).to.be.eq(7)    // 6 Auto Approve options
        expect(tagsOfCategory[0].selected).to.be.eq(true)

        done()
      }, 500)
    })

    it('should add a tag', (done) => {
      setTimeout(() => {
        // Select tag category 'Department' and tag 'Accounting'
        isoScope.vm.tags.selectedCategory = isoScope.vm.tags.categories[8]
        isoScope.$digest()
        isoScope.vm.tags.selectedTag = isoScope.vm.tags.filtered[2]
        isoScope.$digest()

        expect(isoScope.vm.tags.selectedTag.name).to.be.eq('/managed/department/accounting')

        let tagCategorySelect = element.find('.tag-category-select')
        let tagCategories = angular.element(tagCategorySelect).find('option')
        expect(tagCategories[8].text).to.be.eq('Department')
        expect(tagCategories[8].selected).to.be.eq(true)

        let tagsOfCategorySelect = element.find('.tag-value-select')
        let tagsOfCategory = angular.element(tagsOfCategorySelect).find('option')
        expect(tagsOfCategory[2].text).to.be.eq('Accounting')
        expect(tagsOfCategory[2].selected).to.be.eq(true)

        // should be 2 existing tags
        let tagsOfItem = element.find('.pficon-close')
        expect(tagsOfItem.length).to.be.eq(2)

        let addItem = element.find('.fa-plus')
        expect(addItem.length).to.be.eq(1)
        addItem[0].click()
        isoScope.$digest()

        // should now have three tags
        tagsOfItem = element.find('.pficon-close')
        expect(tagsOfItem.length).to.be.eq(3)

        done()
      }, 500)
    })

    it('should replace single-value tags', (done) => {
      setTimeout(() => {
        // There is an existing 'single-value' tag
        let tagsOfItem = element.find('.pficon-close')
        expect(tagsOfItem.length).to.be.eq(2)
        expect(angular.element(tagsOfItem[1]).parent().parent().text().trim()).to.be.eq('Service Level: Gold')

        // Select tag category 'Service Level' and tag 'Platinum'
        isoScope.vm.tags.selectedCategory = isoScope.vm.tags.categories[24]
        isoScope.$digest()
        isoScope.vm.tags.selectedTag = isoScope.vm.tags.filtered[4]
        isoScope.$digest()

        expect(isoScope.vm.tags.selectedTag.name).to.be.eq('/managed/service_level/platinum')

        let tagCategorySelect = element.find('.tag-category-select')
        let tagCategories = angular.element(tagCategorySelect).find('option')
        expect(tagCategories[24].text).to.be.eq('Service Level')
        expect(tagCategories[24].selected).to.be.eq(true)

        let tagsOfCategorySelect = element.find('.tag-value-select')
        let tagsOfCategory = angular.element(tagsOfCategorySelect).find('option')
        expect(tagsOfCategory[4].text).to.be.eq('Platinum')
        expect(tagsOfCategory[4].selected).to.be.eq(true)

        // This should replace Service Level Gold with Service Level Platinum
        let addItem = element.find('.fa-plus')
        expect(addItem.length).to.be.eq(1)
        addItem[0].click()

        isoScope.$digest()

        // Second Tag should now be Service Level: Platinum
        tagsOfItem = element.find('.pficon-close')
        expect(tagsOfItem.length).to.be.eq(2)
        expect(angular.element(tagsOfItem[1]).parent().parent().text().trim()).to.be.eq('Service Level: Platinum')

        done()
      }, 500)
    })

    it('should remove a tag', (done) => {
      setTimeout(() => {
        let tagsOfItem = element.find('.pficon-close')
        expect(tagsOfItem.length).to.be.eq(2)

        tagsOfItem[1].click()
        isoScope.$digest()

        tagsOfItem = element.find('.pficon-close')
        expect(tagsOfItem.length).to.be.eq(1)

        done()
      }, 500)
    })
  })
})

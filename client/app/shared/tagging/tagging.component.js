import './_tagging.sass'
import template from './tagging.html';

export const TaggingComponent = {
  bindings: {
    tagsOfItem: '=',
    readOnly: '='
  },
  controller: TaggingController,
  controllerAs: 'vm',
  template,
}

/** @ngInject */
function TaggingController ($scope, $filter, $log, CollectionsApi, TaggingService, lodash) {
  const vm = this
  const placeholderCategorization = {
    placeholder: true,
    categorization: {
      description: __('Select a value to assign')
    }
  }

  vm.tags = {}

  function loadAllTagInfo () {
    return vm.loadAllTags()
      .then(() => vm.loadAllCategories());
  }

  vm.loadAllTags = function () {
    var options = {
      expand: 'resources',
      attributes: ['categorization', 'category.id', 'category.single_value'],
    };

    return CollectionsApi.query('tags', options)
      .then(loadSuccess, loadFailure);

    function loadSuccess(response) {
      vm.tags.all = response.resources;
    }

    function loadFailure(err) {
      $log.error('There was an error loading all tags.');
      return Promise.reject(err);
    }
  }

  vm.loadAllCategories = function () {
    var options = {
      expand: 'resources',
    }

    return CollectionsApi.query('categories', options)
      .then(loadSuccess, loadFailure);

    function loadSuccess(response) {
      vm.tags.categories = lodash.sortBy(response.resources, 'description')
      vm.tags.selectedCategory = vm.tags.categories[0]
    }

    function loadFailure(err) {
      $log.error('There was an error loading categories.')
      return Promise.reject(err);
    }
  }

  if (!vm.readOnly) {
    loadAllTagInfo()
  }

  vm.showTagDropdowns = false

  $scope.$watch('vm.tags.selectedCategory', function () {
    vm.tags.filtered = $filter('filter')(vm.tags.all, matchCategory)
    if (vm.tags.filtered) {
      vm.tags.filtered.unshift(placeholderCategorization)
      vm.tags.selectedTag = vm.tags.filtered[0]
      vm.showTagDropdowns = !vm.readOnly
    }
  }, true)

  function matchCategory (tag) {
    if (tag.category) {
      return tag.category.id === vm.tags.selectedCategory.id
    } else {
      return false
    }
  }

  vm.removeTag = function (tag) {
    var index = vm.tagsOfItem.indexOf(tag)
    if (index !== -1) {
      vm.tagsOfItem.splice(index, 1)
    }
  }

  vm.addTag = function () {
    // Handle single_value category/tags
    if (vm.tags.selectedTag.category && angular.isDefined(vm.tags.selectedTag.category.single_value)) {
      if (vm.tags.selectedTag.category.single_value) {
        // Find existing tag w/ category in tags.of_item
        for (var i = 0; i < vm.tagsOfItem.length; i++) {
          var tag = vm.tagsOfItem[i]
          if (tag.category.id === vm.tags.selectedTag.category.id) {
            vm.removeTag(tag)
            break
          }
        }
      }
    }

    var matchingTag = $filter('filter')(vm.tagsOfItem, {id: vm.tags.selectedTag.id})

    // Add Selected Tag
    if (!matchingTag.length) {
      var parsedTag = TaggingService.parseTag(vm.tags.selectedTag)
      vm.tagsOfItem.push(parsedTag)
    }
  }
}

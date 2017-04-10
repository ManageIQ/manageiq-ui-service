import './_tag-editor.sass';
import templateUrl from './tag-editor.html';

export const TagEditorComponent = {
  bindings: {
    tagsOfItem: '<',
  },
  controller: TagEditorController,
  controllerAs: 'vm',
  templateUrl,
};

/** @ngInject */
function TagEditorController($scope, $filter, $log, CollectionsApi, TaggingService, lodash) {
  const vm = this;
  const placeholderCategorization = {
    categorization: {
      description: __('Select a value to assign'),
    },
  };

  vm.$onInit = function() {
    vm.tags = {};
    vm.showTagDropdowns = false;

    $scope.$watch('vm.tags.selectedCategory', function() {
      vm.tags.filtered = $filter('filter')(vm.tags.all, matchCategory);
      if (vm.tags.filtered) {
        vm.tags.filtered[0] = placeholderCategorization;
        vm.tags.selectedTag = vm.tags.filtered[0];
        vm.showTagDropdowns = true;
      }
    }, true);

    TaggingService.queryAvailableTags()
      .then((tags) => {
        vm.tags.all = tags;
      })
      .then(() => CollectionsApi.query('categories', { expand: 'resources' }))
      .then((response) => {
        vm.tags.categories = lodash.sortBy(response.resources, 'description');
        vm.tags.selectedCategory = vm.tags.categories[0];
      })
      .catch((error) => {
        $log.error('There was an error loading all tags.', error);
      });
  };

  function matchCategory(tag) {
    if (tag.category) {
      return tag.category.id === vm.tags.selectedCategory.id;
    } else {
      return false;
    }
  }

  vm.removeTag = function(event) {
    var index = vm.tagsOfItem.indexOf(event.tag);
    if (index !== -1) {
      vm.tagsOfItem.splice(index, 1);
    }
  };

  vm.addTag = function() {
    // Handle single_value category/tags
    if (vm.tags.selectedTag.category && angular.isDefined(vm.tags.selectedTag.category.single_value)) {
      if (vm.tags.selectedTag.category.single_value) {
        // Find existing tag w/ category in tags.of_item
        for (var i = 0; i < vm.tagsOfItem.length; i++) {
          var tag = vm.tagsOfItem[i];
          if (tag.category.id === vm.tags.selectedTag.category.id) {
            vm.removeTag(tag);
            break;
          }
        }
      }
    }

    var matchingTag = $filter('filter')(vm.tagsOfItem, {id: vm.tags.selectedTag.id});

    // Add Selected Tag
    if (!matchingTag.length) {
      var parsedTag = TaggingService.parseTag(vm.tags.selectedTag);
      vm.tagsOfItem.push(parsedTag);
    }
  };
}

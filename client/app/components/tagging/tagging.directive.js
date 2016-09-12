(function() {
  'use strict';

  angular.module('app.components')
    .directive('taggingWidget', taggingDirective);

  /** @ngInject */
  function taggingDirective($document) {
    var directive = {
      restrict: 'E',
      scope: {
        tags: '='
      },
      controller: TaggingController,
      templateUrl: 'app/components/tagging/tagging.html',
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function TaggingController($scope, $filter) {
      var vm = this;

      $scope.$watch('vm.tags.selectedCategory', function(value) {
        vm.tags.filtered = $filter('filter')(vm.tags.all, matchCategory);
        if (vm.tags.filtered) {
          vm.tags.selectedTag = vm.tags.filtered[0];
        }
      }, true);

      function matchCategory(tag) {
        if (tag.category) {
          return tag.category.id === vm.tags.selectedCategory.id;
        } else {
          return false;
        }
      }

      $scope.addTag = function() {
        // Handle single_value category/tags
        if (vm.tags.selectedTag.category && vm.tags.selectedTag.category.single_value !== undefined) {
          if (vm.tags.selectedTag.category.single_value) {
            // Find existing tag w/ category in tags.of_item
            for (var i = 0; i < vm.tags.of_item.length; i++) {
              var tag = vm.tags.of_item[i];
              if (tag.category.id === vm.tags.selectedTag.category.id) {
                $scope.removeTag(tag);
                break;
              }
            }
          }
        }
        // Add Selected Tag
        if (vm.tags.of_item.indexOf(vm.tags.selectedTag) === -1) {
          vm.tags.of_item.push(vm.tags.selectedTag);
        }
      };

      $scope.removeTag = function(tag) {
        var inBlueprintIndex = vm.tags.of_item.indexOf(tag);
        if (inBlueprintIndex !== -1) {
          vm.tags.of_item.splice(inBlueprintIndex, 1);
        }
      };
    }
  }
})();

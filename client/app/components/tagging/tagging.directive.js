(function() {
  'use strict';

  angular.module('app.components')
    .directive('taggingWidget', taggingDirective);

  /** @ngInject */
  function taggingDirective($document) {
    var directive = {
      restrict: 'E',
      scope: {
        tags: '=',
        objectType: '@?',
        objectId: '=?',
      },
      controller: TaggingController,
      templateUrl: 'app/components/tagging/tagging.html',
      controllerAs: 'vm',
      bindToController: true,
    };

    return directive;

    /** @ngInject */
    function TaggingController($scope, $filter, $q, CollectionsApi) {
      var vm = this;

      if (!vm.tags) {
        vm.tags = {};
      }

      if (!vm.tags.ofItem && vm.objectType && vm.objectId) {
        if (vm.objectId !== -1) {
          loadTagsOfItem().then(function() {
            loadAllTagInfo();
          });
        } else {
          vm.tags.ofItem = [];
          loadAllTagInfo();
        }
      } else {
        loadAllTagInfo();
      }

      function loadAllTagInfo() {
        var deferred = $q.defer();

        loadAllTags().then(function() {
          loadAllCategories().then(function() {
            deferred.resolve();
          }, loadAllTagsfailure);
        }, loadAllCategoriesfailure);

        function loadAllTagsfailure() {
          deferred.reject();
        }
        function loadAllCategoriesfailure() {
          deferred.reject();
        }

        return deferred.promise;
      }

      function loadAllTags() {
        var deferred = $q.defer();

        var attributes = ['categorization', 'category.id', 'category.single_value'];
        var options = {
          expand: 'resources',
          attributes: attributes,
        };

        CollectionsApi.query('tags', options).then(loadSuccess, loadFailure);

        function loadSuccess(response) {
          vm.tags.all = response.resources;
          deferred.resolve();
        }

        function loadFailure() {
          console.log('There was an error loading all tags.');
          deferred.reject();
        }

        return deferred.promise;
      }

      function loadAllCategories() {
        var deferred = $q.defer();

        var options = {
          expand: 'resources',
        };

        CollectionsApi.query('categories', options).then(loadSuccess, loadFailure);

        function loadSuccess(response) {
          vm.tags.categories = response.resources;
          vm.tags.selectedCategory = vm.tags.categories[0];
          deferred.resolve();
        }

        function loadFailure() {
          console.log('There was an error loading categories.');
          deferred.reject();
        }

        return deferred.promise;
      }

      function loadTagsOfItem() {
        var deferred = $q.defer();

        var attributes = ['categorization', 'category.id', 'category.single_value'];
        var options = {
          expand: 'resources',
          attributes: attributes,
        };

        var collection = vm.objectType + "\/" + vm.objectId + "\/" + 'tags';

        CollectionsApi.query(collection, options).then(loadSuccess, loadFailure);

        function loadSuccess(response) {
          vm.tags.ofItem = response.resources;
          deferred.resolve();
        }

        function loadFailure() {
          console.log('There was an error loading ' + vm.objectType + ', id = ' + vm.objectId);
          deferred.reject();
        }

        return deferred.promise;
      }

      vm.tagsOfItemChanged = false;
      $scope.$on('$destroy', function() {
        if (vm.tagsOfItemChanged) {
          $scope.$emit('tagsOfItemChanged');
        }
      });

      vm.showTagDropdowns = false;
      $scope.$watch('vm.tags.selectedCategory', function(value) {
        vm.tags.filtered = $filter('filter')(vm.tags.all, matchCategory);
        if (vm.tags.filtered) {
          vm.tags.selectedTag = vm.tags.filtered[0];
          vm.showTagDropdowns = true;
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
        if (vm.tags.selectedTag.category && angular.isDefined(vm.tags.selectedTag.category.single_value)) {
          if (vm.tags.selectedTag.category.single_value) {
            // Find existing tag w/ category in tags.of_item
            for (var i = 0; i < vm.tags.ofItem.length; i++) {
              var tag = vm.tags.ofItem[i];
              if (tag.category.id === vm.tags.selectedTag.category.id) {
                $scope.removeTag(tag);
                break;
              }
            }
          }
        }
        // Add Selected Tag
        if (vm.tags.ofItem.indexOf(vm.tags.selectedTag) === -1) {
          saveOriginalTags();
          vm.tags.ofItem.push(vm.tags.selectedTag);
        }
      };

      $scope.removeTag = function(tag) {
        var inBlueprintIndex = vm.tags.ofItem.indexOf(tag);
        if (inBlueprintIndex !== -1) {
          saveOriginalTags();
          vm.tags.ofItem.splice(inBlueprintIndex, 1);
        }
      };

      function saveOriginalTags() {
        if (!vm.tags.orig_of_item) {
          vm.tagsOfItemChanged = true;
          vm.tags.orig_of_item = angular.copy(vm.tags.ofItem);
        }
      }
    }
  }
})();

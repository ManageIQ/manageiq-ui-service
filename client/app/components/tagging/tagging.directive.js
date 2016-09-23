(function() {
  'use strict';

  angular.module('app.components')
    .directive('taggingWidget', taggingDirective);

  /** @ngInject */
  function taggingDirective($document) {
    var directive = {
      restrict: 'E',
      scope: {
        tagsOfItem: '=',
      },
      controller: TaggingController,
      templateUrl: 'app/components/tagging/tagging.html',
      controllerAs: 'vm',
      bindToController: true,
    };

    return directive;

    /** @ngInject */
    function TaggingController($scope, $filter, $q, $log, CollectionsApi) {
      var vm = this;

      vm.tags = {};

      loadAllTagInfo();

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
          $log.error('There was an error loading all tags.');
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
          $log.error('There was an error loading categories.');
          deferred.reject();
        }

        return deferred.promise;
      }

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
            for (var i = 0; i < vm.tagsOfItem.length; i++) {
              var tag = vm.tagsOfItem[i];
              if (tag.category.id === vm.tags.selectedTag.category.id) {
                $scope.removeTag(tag);
                break;
              }
            }
          }
        }

        var matchingTag = $filter('filter')(vm.tagsOfItem, {id: vm.tags.selectedTag.id});

        // Add Selected Tag
        if (!matchingTag.length) {
          vm.tagsOfItem.push(getSmTagObj(vm.tags.selectedTag));
        }
      };

      $scope.removeTag = function(tag) {
        var index = vm.tagsOfItem.indexOf(tag);
        if (index !== -1) {
          vm.tagsOfItem.splice(index, 1);
        }
      };

      function getSmTagObj(tag) {
        return {id: tag.id,
                category: {id: tag.category.id},
                categorization: {
                  display_name: tag.categorization.display_name,
                }
              };
      }
    }
  }
})();

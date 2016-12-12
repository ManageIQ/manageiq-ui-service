(function() {
  'use strict';

  angular.module('app.components')
    .component('taggingWidget', {
      bindings: {
        tagsOfItem: '=',
        readOnly: '='
      },
      controller: TaggingController,
      controllerAs: 'vm',
      templateUrl: 'app/components/tagging/tagging.html',
    });

  /** @ngInject */
  function TaggingController($scope, $filter, $q, $log, CollectionsApi) {
    var vm = this;

    vm.tags = {};

    function loadAllTagInfo() {
      var deferred = $q.defer();

      vm.loadAllTags().then(function() {
        vm.loadAllCategories().then(function() {
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

    vm.loadAllTags = function() {
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
    };

    vm.loadAllCategories = function() {
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
    };

    if (!vm.readOnly) {
      loadAllTagInfo();
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

    vm.removeTag = function(tag) {
      var index = vm.tagsOfItem.indexOf(tag);
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
        vm.tagsOfItem.push(getSmTagObj(vm.tags.selectedTag));
      }
    };

    function getSmTagObj(tag) {
      return {
        id: tag.id,
        category: {id: tag.category.id},
        categorization: {
          displayName: tag.categorization.display_name,
        },
      };
    }
  }
})();

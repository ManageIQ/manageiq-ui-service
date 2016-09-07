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
        vm.tags.filtered = $filter('filter')(vm.tags.all, {name: vm.tags.selectedCategory.name});
        if (vm.tags.filtered) {
          vm.tags.selectedTag = vm.tags.filtered[0];
        }
      }, true);

      $scope.addTag = function() {
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

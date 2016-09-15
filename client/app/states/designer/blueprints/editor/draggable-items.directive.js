(function() {
  'use strict';

  angular.module('app.components')
    .directive('draggableItems', draggableItemsDirective);

  /** @ngInject */
  function draggableItemsDirective($document) {
    var directive = {
      restrict: 'E',
      scope: {
        items: '=',
        startDragCallback: '=',
        clickCallback: '='
      },
      controller: draggableItemsController,
      templateUrl: 'app/states/designer/blueprints/editor/draggable-items.html',
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function draggableItemsController($scope, $filter, $log) {
      var vm = this;  // jshint ignore:line

      vm.clickCallbackfmDir = function(item) {
        vm.clickCallback(item);
      };

      vm.startDragCallbackfmDir = function(event, ui, item) {
        vm.startDragCallback(event, ui, item);
      };
    }
  }
})();

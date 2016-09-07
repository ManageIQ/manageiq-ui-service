(function() {
  'use strict';

  angular.module('app.components')
    .directive('nodeToolbar', nodeToolbarDirective);

  /** @ngInject */
  function nodeToolbarDirective($document) {
    var directive = {
      restrict: 'E',
      scope: {
        node: '=',
        nodeActions: '='
      },
      controller: NodeToolbarController,
      templateUrl: 'app/components/flowchart/node-toolbar.html',
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NodeToolbarController($scope) {
      var vm = this;
      vm.selectedAction = "none";

      $scope.getLeft = function() {
        return vm.node.x() + "px";
      };
      $scope.getTop = function() {
        return vm.node.y() + "px";
      };

      $scope.actionIconClicked = function(action) {
        vm.selectedAction = action;
        $scope.$emit('nodeActionClicked', {'action': action, 'node': vm.node});
      };
    }
  }
})();

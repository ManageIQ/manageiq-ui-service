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
        nodeActions: '=',
      },
      controller: NodeToolbarController,
      templateUrl: 'app/components/flowchart/node-toolbar.html',
      controllerAs: 'vm',
      bindToController: true,
    };

    return directive;

    /** @ngInject */
    function NodeToolbarController($scope) {
      var vm = this;
      vm.selectedAction = "none";

      if (vm.node.tags()) {
        vm.tags = {'of_item': vm.node.tags()};
      }

      // listen for tags changing
      $scope.$on('tagsOfItemChanged', function() {
        if (!vm.node.origTags()) {
          vm.node.setOrigTags(vm.tags.origOfItem);
        }
        vm.node.setTags(vm.tags.ofItem);
      });

      $scope.actionIconClicked = function(action) {
        vm.selectedAction = action;
        $scope.$emit('nodeActionClicked', {'action': action, 'node': vm.node});
      };

      $scope.close = function() {
        vm.selectedAction = 'none';
        vm.node.toolbarDlgOpen = false;
        $scope.$emit('nodeActionClosed');
      };
    }
  }
})();

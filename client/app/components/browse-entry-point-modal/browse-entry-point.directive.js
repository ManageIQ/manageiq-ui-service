(function() {
  'use strict';

  angular.module('app.components')
    .directive('browseEntryPoint', browseEntryPointDirective);

  /** @ngInject */
  function browseEntryPointDirective() {
    var directive = {
      restrict: 'A',
      link: link,
    };

    return directive;

    function link(scope, element, attrs) {
      angular.element('#entryPointsTree').treeview({
        collapseIcon: "fa fa-angle-down",
        data: scope.vm.getTreeNodes(),
        levels: 2,
        expandIcon: "fa fa-angle-right",
        nodeIcon: "fa fa-folder",
        showBorder: false,
        onNodeExpanded: function(event, node) {
          scope.vm.onNodeExpanded(event, node);
        },
      });

      // Get the inital root nodes
      var i;
      var rootNode = angular.element('#entryPointsTree').treeview('getExpanded');

      // Collapse all
      angular.element('#entryPointsTree').treeview('collapseAll');
      // Auto-magically expand the root nodes
      for (i = 0; i < rootNode.length; i++) {
        angular.element('#entryPointsTree').treeview('expandNode', [rootNode[i].nodeId]);
      }
    }
  }
})();

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
      $('#entryPointsTree').treeview({
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
      var rootNode = $('#entryPointsTree').treeview('getExpanded');

      // Collapse all
      $('#entryPointsTree').treeview('collapseAll');
      // Auto-magically expand the root nodes
      for (i = 0; i < rootNode.length; i++) {
        $('#entryPointsTree').treeview('expandNode', [rootNode[i].nodeId]);
      }
    }
  }
})();

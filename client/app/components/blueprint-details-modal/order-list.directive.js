/**
 * Order Lists have the following pseudo-structure:
 *
 *   1. List/Container[0].columns[0][ItemA, ItemB].columns[1][ItemC, ItemD] ]
 *   2. List/Container[1].columns[0][ItemE, ItemF].columns[1][ItemG, ItemH] ]
 *   etc...
 *
 * JSON obj.:
 *     "list": [
 *        {
 *          "type": "container",
 *          "id": 1                  // id is used for row #. Ex "1. ---"
 *          "columns": [             // left and right 'columns' within the 'container'
 *            [
 *              { "id": 10, "name": "AWS", "disabled": false, "type": "item"}
 *            ],
 *            [
 *              {"id": 11, "name": "Azure", "disabled": false, "type": "item"}
 *            ]
 *          ]
 *        },
 *        ...
 *        ... additional containers/rows
 *      ]
 */
(function() {
  'use strict';

  angular.module('app.components')
    .directive('orderList', OrderListDirective);

  /** @ngInject */
  function OrderListDirective() {
    var directive = {
      restrict: 'AE',
      replace: true,
      scope: {
        list: '='
      },
      templateUrl: 'app/components/blueprint-details-modal/order-list.directive.html',
      controller: OrderListController
    };

    return directive;
  }

  function OrderListController($scope, $filter) {
    $scope.listDisabled = false;

    normalizeContainers();

    $scope.moved = function(list, index) {
      var origItem = angular.copy(list[index]);

      // Remove item from orig. list/column
      list.splice(index, 1);

      normalizeContainers();

      $scope.$emit('dnd-item-moved', {'item': origItem});
    };

    function normalizeContainers() {
      // Remove any empty rows and balance 'columns'/lists of items
      // Empty/undefined rows may happen if item.id's are not sequential
      var containers = $filter('orderBy')($scope.list, 'id');
      var container;
      for (var i = 0; i < containers.length; i++) {
        container = containers[i];
        if (container.type === 'container') {
          if (container.columns[0].length === 0 && container.columns[1].length === 0) {
            // Remove Empty Row
            containers.splice(i, 1);
          } else {
            container.columns = balanceColumns(container.columns[0], container.columns[1]);
          }
        }
      }

      // if last row not empty, add new empty row (list number)
      container = containers[containers.length - 1];
      if (container && container.type === 'container' && !$scope.listDisabled &&
         (container.columns[0].length !== 0 || container.columns[1].length !== 0)) {
        addEmptyContainerRow(containers);
      }

      renumberContainersList( containers );

      $scope.list = containers;
    }

    function addEmptyContainerRow( containers ) {
      containers.push(
          {
            "type": "container",
            "columns": [
              [],
              []
            ]
          }
      );
    }

    function balanceColumns(left, right) {
      var all = left.concat(right);
      // sort all items in container alphabetically by name
      all = $filter('orderBy')(all, 'name');
      left = [];
      right = [];

      for (var i = 0; i < all.length; i += 1) {
        // all items in a list should all be enabled or disabled
        // order-list directive does not support disabling individual items in a list
        $scope.listDisabled = all[i].disabled;
        if ( isEven(i) ) {
          left.push(all[i]);
        } else {
          right.push(all[i]);
        }
      }

      return [left, right];
    }

    function isEven(n) {
      return n % 2 === 0;
    }

    function renumberContainersList( containers ) {
      for (var i = 0; i < containers.length; i++) {
        containers[i].id = i + 1;
      }
    }
  }
})();

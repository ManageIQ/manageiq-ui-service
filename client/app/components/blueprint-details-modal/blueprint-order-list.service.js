(function() {
  'use strict';

  angular.module('app.components')
      .factory('BlueprintOrderListService', BlueprintOrderListFactory);

  /** @ngInject */
  function BlueprintOrderListFactory(CollectionsApi, Notifications, sprintf, $q) {
    var orderListSrv = {};

    /*
     * This method converts the service items on a blueprint's canvas into a structure
     * required for the DND Provision and Action Order Lists.
     */
    orderListSrv.setOrderLists = function(vm) {
      var blueprintServiceItems = vm.blueprint.ui_properties.chartDataModel.nodes;
      var items = angular.copy(blueprintServiceItems);
      var lists = [];
      var item;
      var order;
      var i;
      var l;

      // lists[0] = prov. order list, lists[1] = action order list
      lists[0] = {"containers": []};
      lists[1] = {"containers": []};

      // Mark all blueprint service items as type = 'item'
      // Put into appropriate list order 'containers'
      for (i = 0; i < items.length; i++) {
        item = items[i];
        item.type = "item";
        if (!item.provision_order) {
          item.provision_order = 0;
        }
        // Add item to provOrderList and actionOrderList
        for (l = 0; l < 2; l++) {
          if (l === 0) {
            item.parentListName = "provOrder";    // parentListName denotes which list an item was dragged from
            order = item.provision_order;
          } else if (item.action_order !== undefined) {
            item = angular.copy(items[i]);
            item.parentListName = "actionOrder";
            order = item.action_order;
          } else {
            // no action order defined, only build provOrder list
            continue;
          }
          // if container already exists, push in new item
          if (lists[l].containers[order]) {
            lists[l].containers[order].columns[0].push(item);
          } else {
            // create new container
            lists[l].containers[order] =
            {
              "type": "container",
              "columns": [
                [item],
                [],
              ],
            };
          }
        }
      }

      // Set dndModels
      vm.dndModels = {'provOrder': {}, 'actionOrder': {}};

      // lists[0] = prov. order list
      vm.dndModels.provOrder = {
        selected: null,
        list: lists[0].containers,
      };

      // lists[1] = action order list
      if (lists[1].containers.length) {  // does actionOrder list have any rows?
        // action order has unique order and is editable
        vm.actionOrderEqualsProvOrder = false;
        vm.dndModels.actionOrder = {
          selected: null,
          list: lists[1].containers,
        };
      } else {
        // action order == prov. order
        vm.actionOrderEqualsProvOrder = true;
        orderListSrv.initActionOrderFromProvOrderList(vm);
      }
    };

    orderListSrv.initActionOrderFromProvOrderList = function(vm) {
      // Make actionOrder list a new list, set parentListName to 'actionOrder'
      var actionOrderList = angular.copy(vm.dndModels.provOrder.list);
      for (var l = 0; l < actionOrderList.length; l++) {
        for (var cols = 0; cols < actionOrderList[l].columns.length; cols++) {  // will be 2 columns
          for (var col = 0; col < actionOrderList[l].columns[cols].length; col++) {  // Number of items in a column
            var item = actionOrderList[l].columns[cols][col];
            item.parentListName = "actionOrder";
            item.disabled = vm.actionOrderEqualsProvOrder;
          }
        }
      }

      var lastrow = actionOrderList[ actionOrderList.length - 1 ];
      if (lastrow && vm.actionOrderEqualsProvOrder && lastrow.columns[0].length === 0 && lastrow.columns[1].length === 0) {
        // remove last empty row
        actionOrderList.splice(actionOrderList.length - 1, 1);
      }

      vm.dndModels.actionOrder.list = actionOrderList;
    };

    orderListSrv.saveOrder = function(orderType, vm) {
      var list;

      if (orderType === 'provisionOrder') {
        list = vm.dndModels.provOrder.list;
      } else if (orderType === 'actionOrder') {
        list = vm.dndModels.actionOrder.list;
      }

      for (var i = 0; i < list.length; i++) {
        var container = list[i];
        if (container.type === 'container') {
          var items = container.columns[0].concat(container.columns[1]);
          for (var j = 0; j < items.length; j++) {
            var item = items[j];
            orderListSrv.updateOrder(orderType, item, container.id - 1, vm);
          }
        }
      }
    };

    orderListSrv.updateOrder = function(orderType, item, orderNum, vm) {
      for (var i = 0; i < vm.blueprint.ui_properties.chartDataModel.nodes.length; i++) {
        var node = vm.blueprint.ui_properties.chartDataModel.nodes[i];
        if (node.id === item.id && node.name === item.name) {
          if (orderType === 'provisionOrder') {
            node.provision_order = orderNum;
          } else if (orderType === 'actionOrder') {
            if (vm.actionOrderEqualsProvOrder) {
              // remove action_order, defer to provision_order
              delete node.action_order;
            } else {
              node.action_order = orderNum;
            }
          }

          return;
        }
      }
    };

    return orderListSrv;
  }
})();

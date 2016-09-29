/* eslint camelcase: "off" */

(function() {
  'use strict';

  angular.module('app.components')
    .factory('BlueprintOrderListService', BlueprintOrderListFactory);

  /** @ngInject */
  function BlueprintOrderListFactory(CollectionsApi, sprintf, $q) {
    var orderListSrv = {};

    /*
     * This method converts the service items on a blueprint's canvas into a structure
     * required for the DND Provision and Action Order Lists.
     */
    orderListSrv.setOrderLists = function(obj) {
      var blueprintServiceItems = obj.blueprint.ui_properties.chart_data_model.nodes;
      var items = angular.copy(blueprintServiceItems);
      var lists = [];
      var i, item, l, order;

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
          } else if (angular.isDefined(item.action_order)) {
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
            lists[l].containers[order] = {
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
      obj.dndModels = {'provOrder': {}, 'actionOrder': {}};

      // lists[0] = prov. order list
      obj.dndModels.provOrder = {
        selected: null,
        list: lists[0].containers,
      };

      // lists[1] = action order list
      if (lists[1].containers.length) {  // does actionOrder list have any rows?
        // action order has unique order and is editable
        obj.actionOrderEqualsProvOrder = false;
        obj.dndModels.actionOrder = {
          selected: null,
          list: lists[1].containers,
        };
      } else {
        // action order == prov. order
        obj.actionOrderEqualsProvOrder = true;
        orderListSrv.initActionOrderFromProvOrderList(obj);
      }
    };

    orderListSrv.initActionOrderFromProvOrderList = function(obj) {
      // Make actionOrder list a new list, set parentListName to 'actionOrder'
      var actionOrderList = angular.copy(obj.dndModels.provOrder.list);
      for (var l = 0; l < actionOrderList.length; l++) {
        for (var cols = 0; cols < actionOrderList[l].columns.length; cols++) {  // will be 2 columns
          for (var col = 0; col < actionOrderList[l].columns[cols].length; col++) {  // Number of items in a column
            var item = actionOrderList[l].columns[cols][col];
            item.parentListName = "actionOrder";
            item.disabled = obj.actionOrderEqualsProvOrder;
          }
        }
      }

      var lastrow = actionOrderList[actionOrderList.length - 1];
      if (lastrow && obj.actionOrderEqualsProvOrder && lastrow.columns[0].length === 0 && lastrow.columns[1].length === 0) {
        // remove last empty row
        actionOrderList.splice(actionOrderList.length - 1, 1);
      }

      obj.dndModels.actionOrder.list = actionOrderList;
    };

    orderListSrv.saveOrder = function(orderType, obj) {
      var list;

      if (orderType === 'provisionOrder') {
        list = obj.dndModels.provOrder.list;
      } else if (orderType === 'actionOrder') {
        list = obj.dndModels.actionOrder.list;
      }

      for (var i = 0; i < list.length; i++) {
        var container = list[i];
        if (container.type === 'container') {
          var items = container.columns[0].concat(container.columns[1]);
          for (var j = 0; j < items.length; j++) {
            var item = items[j];
            orderListSrv.updateOrder(orderType, item, container.id - 1, obj);
          }
        }
      }
    };

    orderListSrv.updateOrder = function(orderType, item, orderNum, obj) {
      for (var i = 0; i < obj.blueprint.ui_properties.chart_data_model.nodes.length; i++) {
        var node = obj.blueprint.ui_properties.chart_data_model.nodes[i];
        if (node.id === item.id && node.name === item.name) {
          if (orderType === 'provisionOrder') {
            node.provision_order = orderNum;
          } else if (orderType === 'actionOrder') {
            if (obj.actionOrderEqualsProvOrder) {
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

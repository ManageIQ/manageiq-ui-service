import "../../../assets/sass/_explorer.sass";
import templateUrl from "./order-explorer.html";

export const OrderExplorerComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  templateUrl,
};

/** @ngInject */
function ComponentController($filter, lodash, ListView, Language, OrdersState, ShoppingCart, EventNotifications, Session, RBAC, ModalService,
                             CollectionsApi, sprintf, Polling, POLLING_INTERVAL) {
  const vm = this;
  vm.permissions = OrdersState.getPermissions();
  vm.$onInit = activate();
  vm.$onDestroy = function() {
    Polling.stop('orderListPolling');
  };

  function activate() {
    angular.extend(vm, {
      currentUser: Session.currentUser(),
      loading: false,
      orders: [],
      limit: 20,
      filterCount: 0,
      ordersList: [],
      selectedItemsList: [],
      limitOptions: [5, 10, 20, 50, 100, 200, 500, 1000],
      // Functions
      resolveOrders: resolveOrders,
      listActionDisable: listActionDisable,
      updatePagination: updatePagination,
      updateMenuActionForItemFn: updateMenuActionForItemFn,
      // Config setup
      menuActions: getMenuActions(),
      toolbarConfig: getToolbarConfig(),
      listConfig: getListConfig(),
      expandedListConfig: getExpandedListConfig(),
      offset: 0,
      pollingInterval: POLLING_INTERVAL,
    });
    OrdersState.setSort({id: "placed_at", title: "Order Date", sortType: "numeric"}, false);
    resolveOrders(vm.limit, 0);
    Polling.start('orderListPolling', pollUpdateOrderList, vm.pollingInterval);
    Language.fixState(OrdersState, vm.toolbarConfig);
  }

  function getListConfig() {
    return {
      showSelectBox: checkApproval(),
      useExpandingRows: true,
      selectionMatchProp: 'id',
      onClick: expandRow,
      onCheckBoxChange: selectionChange,
    };
  }

  function pollUpdateOrderList() {
    resolveOrders(vm.limit, vm.offset, true);
  }

  function getExpandedListConfig() {
    return {
      showSelectBox: checkApproval(),
      selectionMatchProp: 'id',
      onClick: selectItem,
      onCheckBoxChange: extendedSelectionChange,
    };
  }

  function getToolbarConfig() {
    const sortConfig = {
      fields: getOrderSortFields(),
      onSortChange: sortChange,
      isAscending: OrdersState.getSort().isAscending,
      currentField: OrdersState.getSort().currentField,
    };

    const filterConfig = {
      fields: getOrderFilterFields(),
      resultsCount: 0,
      totalCount: 0,
      selectedCount: 0,
      appliedFilters: OrdersState.filterApplied ? OrdersState.getFilters() : [],
      onFilterChange: orderFilterChange,
    };

    return {
      sortConfig: sortConfig,
      filterConfig: filterConfig,
      actionsConfig: {
        actionsInclude: checkApproval(),
      },
    };
  }

  function getOrderFilterFields() {
    return [
      ListView.createFilterField('name', __('Name'), __('Filter by Name'), 'text'),
      ListView.createFilterField('id', __('Order ID'), __('Filter by ID'), 'text'),
      ListView.createFilterField('placed_at', __('Order Date'), __('Filter by Order Date'), 'text'),
    ];
  }

  function getOrderSortFields() {
    return [
      ListView.createSortField('name', __('Name'), 'alpha'),
      ListView.createSortField('id', __('Order ID'), 'numeric'),
      ListView.createSortField('placed_at', __('Order Date'), 'numeric'),
    ];
  }

  function getMenuActions() {
    const menuActions = [];
    if (vm.permissions.copy) {
      menuActions.push({
        name: __('Duplicate'),
        actionName: 'duplicate',
        title: __('Duplicate Order'),
        actionFn: duplicateOrder,
        isDisabled: true,
      });
    }

    if (vm.permissions.delete) {
      menuActions.push(
        {
          name: __('Remove'),
          actionName: 'remove',
          title: __('Remove Order'),
          actionFn: removeOrder,
          isDisabled: false,
        }
      );
    }

    return checkApproval() ? menuActions : null;
  }

  function expandRow(item) {
    if (!item.disableRowExpansion) {
      item.isExpanded = !item.isExpanded;
    }
  }

  function sortChange(sortId, direction) {
    OrdersState.setSort(sortId, direction);
    resolveOrders(vm.limit, 0);
  }

  function orderFilterChange(filters) {
    vm.ordersList = ListView.applyFilters(filters, vm.ordersList, vm.orders, OrdersState, orderMatchesFilter);
    resolveOrders(vm.limit, 0);
  }

  function orderMatchesFilter(item, filter) {
    if (filter.id === 'name') {
      return item.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
    } else if (filter.id === 'id') {
      return String(item.id).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
    } else if (filter.id === 'placed_at') {
      return $filter('date')(item.placed_at || item.updated_at).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
    }

    return false;
  }

  function selectionChange(item) {
    if (angular.isDefined(item.service_requests)) {
      // if any child requests are unchecked, check them otherwise uncheck all
      if (item.service_requests.length === lodash.filter(item.service_requests, returnSelected).length) {
        item.service_requests.forEach((request) => {
          request.selected = false;
        });
      } else {
        item.service_requests.forEach((request) => {
          request.selected = true;
        });
      }
    }
    vm.selectedItemsList = vm.ordersList.filter((item) => item.selected);
    vm.toolbarConfig.filterConfig.selectedCount = vm.selectedItemsList.length;
  }

  function extendedSelectionChange(item) {
    const parent = lodash.find(vm.ordersList, findItem);

    if (parent.service_requests.length === lodash.filter(parent.service_requests, returnSelected).length) {
      parent.selected = !parent.selected;
    } else {
      parent.selected = false;
    }

    lodash.indexOf(vm.selectedItemsList, item) === -1 ? vm.selectedItemsList.push(item) : lodash.pull(vm.selectedItemsList, item);

    vm.toolbarConfig.filterConfig.selectedCount = vm.selectedItemsList.length;

    function findItem(order) {
      return lodash.find(order.service_requests, item);
    }
  }

  function returnSelected(item) {
    return item.selected;
  }

  function resolveOrders(limit, offset, refresh) {
    if (!refresh) {
      vm.loading = true;
    }
    var existingOrders = (angular.isDefined(vm.ordersList) && refresh ? angular.copy(vm.ordersList) : []);

    vm.offset = offset;
    getFilterCount().then(() => {
      OrdersState.getOrders(
        limit,
        offset,
        OrdersState.getFilters(),
        OrdersState.getSort().currentField,
        OrdersState.getSort().isAscending,
        refresh).then(querySuccess, queryFailure);
    });


    function querySuccess(response) {
      vm.loading = false;
      vm.orders = [];
      vm.selectedItemsList = [];
      vm.toolbarConfig.filterConfig.resultsCount = vm.filterCount;
      vm.toolbarConfig.filterConfig.totalCount = response.subcount;

      angular.forEach(response.resources, checkExpansion);

      function checkExpansion(item) {
        if (angular.isDefined(item.id)) {
          item.disableRowExpansion = angular.isUndefined(item.service_requests)
            || (angular.isDefined(item.service_requests) && item.service_requests.length < 1);
          let dataRow = item;
          if (refresh) {
            dataRow = refreshRow(item);
          }
          vm.orders.push(dataRow);
        }
      }

      function refreshRow(item) {
        existingOrders.forEach((order) => {
          if (order.id === item.id) {
            item.isExpanded = angular.isDefined(order.isExpanded) ? order.isExpanded : false;
            item.selected = angular.isDefined(order.selected) ? order.selected : false;
            if (item.selected) {
              vm.selectedItemsList.push(item);
            }
            lodash.pull(existingOrders, order);
          }
        });

        return item;
      }

      vm.ordersList = angular.copy(vm.orders);
    }

    function queryFailure(_error) {
      vm.loading = false;
      EventNotifications.error(__('There was an error loading orders.'));
    }
  }

  function getFilterCount() {
    return new Promise((resolve, reject) => {
      OrdersState.getMinimal(OrdersState.getFilters()).then(querySuccess, queryFailure);

      function querySuccess(result) {
        vm.filterCount = result.subcount;
        resolve();
      }

      function queryFailure(_error) {
        EventNotifications.error(__('There was an error loading orders.'));
        reject();
      }
    });
  }

  function duplicateOrder(_action, item) {
    ShoppingCart.reset();
    ShoppingCart.delete();

    CollectionsApi.post('service_orders', null, null, {action: "copy", resources: [{id: item.id}]}).then(success, failure);

    function success(response) {
      ShoppingCart.reload();
      EventNotifications.success(sprintf(__('%s was duplicated, id # %d.'), item.name, response.results[0].id));
    }

    function failure(_error) {
      EventNotifications.error(sprintf(__('There was an error duplicating %s.'), item.name));
    }
  }

  function removeOrder(_action, item) {
    const modalOptions = {
      component: 'processOrderModal',
      resolve: {
        order: function() {
          return item;
        },
      },
    };
    ModalService.open(modalOptions);
  }

  function checkApproval() {
    return lodash.reduce(lodash.map(['miq_request_approval', 'miq_request_admin'], RBAC.has));
  }

  function selectItem(item) {
    item.selected = !item.selected;
    extendedSelectionChange(item);
  }

  function listActionDisable(config, items) {
    items.length <= 0 ? config.isDisabled = true : config.isDisabled = false;
  }

  function updatePagination(limit, offset) {
    vm.limit = limit;
    vm.offset = offset;
    vm.resolveOrders(limit, offset);
  }

  function updateMenuActionForItemFn(action, item) {
    if (action.actionName === 'duplicate') {
      action.isDisabled = item.state !== 'cart' && angular.isUndefined(item.service_requests);
    }
  }
}

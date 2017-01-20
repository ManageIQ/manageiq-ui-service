(function() {
  'use strict';

  angular.module('app.components')
    .component('orderExplorer', {
      controller: ComponentController,
      controllerAs: 'vm',
      templateUrl: 'app/components/order-explorer/order-explorer.html',
    });


  /** @ngInject */
  function ComponentController($state, OrdersState, $filter, ListView, Language, lodash, EventNotifications, Session, RBAC) {
    const vm = this;
    vm.$onInit = activate();
    function activate() {
      angular.extend(vm, {
        currentUser: Session.currentUser(),
        canApprove: lodash.reduce(lodash.map(['miq_request_approval', 'miq_request_admin'], RBAC.has)),
        loading: false,
        orders: [],
        limit: 20,
        filterCount: 0,
        ordersList: [],
        selectedItemsList: [],
        extendedSelectedItemsList: [],
        limitOptions: [5, 10, 20, 50, 100, 200, 500, 1000],
        selectedItemsListCount: 0,
        // Functions
        resolveOrders: resolveOrders,
        // Config setup
        toolbarConfig: getToolbarConfig(),
        listConfig: getListConfig(),
        expandedListConfig: getExpandedListConfig(),
      });
      resolveOrders(vm.limit, 0);
    }

    function getListConfig() {
      return {
        showSelectBox: true,
        useExpandingRows: true,
        selectionMatchProp: 'id',
        onClick: expandRow,
        onCheckBoxChange: selectionChange,
      };
    }

    function getExpandedListConfig() {
      return {
        showSelectBox: true,
        selectionMatchProp: 'id',
        onClick: expandRow,
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
        appliedFilters: OrdersState.filterApplied ? OrdersState.getFilters() : [],
        onFilterChange: orderFilterChange,
      };

      return {
        sortConfig: sortConfig,
        filterConfig: filterConfig,
        actionsConfig: {
          actionsInclude: true,
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

    function expandRow(item) {
      if (!item.disableRowExpansion) {
        item.isExpanded = !item.isExpanded;
      }
    }

    function sortChange(sortId, direction) {
      OrdersState.setSort(sortId, direction);
      resolveOrders(vm.limit, 0);
    }

    function orderCompareFn(item1, item2) {
      let compValue = 0;
      if (vm.toolbarConfig.sortConfig.currentField.id === 'name') {
        compValue = item1.name.localeCompare(item2.name);
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'id') {
        compValue = item1.id - item2.id;
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'placed_at') {
        compValue = new Date(item1.placed_at || item1.updated_at) - new Date(item2.placed_at || item2.updated_at);
      }

      if (!vm.toolbarConfig.sortConfig.isAscending) {
        compValue = compValue * -1;
      }

      return compValue;
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
        angular.forEach(item.service_requests, checkAll);
      }

      function checkAll(item) {
        item.selected = !item.selected;
      }

      vm.extendedSelectedItemsList = item.service_requests.filter(function(service) {
        return service.selected;
      });

      vm.selectedItemsListCount = vm.selectedItemsList.length;
    }

    function extendedSelectionChange() {
      vm.extendedSelectedItemsList = vm.ordersList.filter(function(service) {
        return service.selected;
      });
      vm.extendedSelectedItemsList = vm.extendedSelectedItemsList.length;
    }

    function resolveOrders(limit, offset) {
      vm.loading = true;
      OrdersState.getOrders(
        limit,
        offset,
        OrdersState.getFilters(),
        OrdersState.getSort().currentField,
        OrdersState.getSort().isAscending).then(querySuccess, queryFailure);

      function querySuccess(response) {
        vm.loading = false;
        vm.orders = [];
        vm.selectedItemsList = [];
        vm.toolbarConfig.filterConfig.resultsCount = vm.filterCount;

        angular.forEach(response.resources, checkExpansion);

        function checkExpansion(item) {
          if (angular.isDefined(item.id)) {
            item.disableRowExpansion = angular.isUndefined(item.service_requests)
              || (angular.isDefined(item.service_requests) && item.service_requests.length < 1);
            vm.orders.push(item);
          }
        }

        vm.ordersList = angular.copy(vm.orders);

        getFilterCount();
      }

      function queryFailure(error) {
        vm.loading = false;
        EventNotifications.error(__('There was an error loading orders.'));
      }
    }

    function getFilterCount() {
      OrdersState.getMinimal(OrdersState.getFilters()).then(querySuccess, queryFailure);

      function querySuccess(result) {
        vm.filterCount = result.subcount;
      }

      function queryFailure(error) {
        EventNotifications.error(__('There was an error loading orders.'));
      }
    }


    Language.fixState(OrdersState, vm.toolbarConfig);
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'requests.list': {
        url: '',
        templateUrl: 'app/states/requests/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('Request List'),
        resolve: {
          requests: resolveRequests,
          orders: resolveOrders,
        }
      }
    };
  }

  /** @ngInject */
  function resolveRequests(CollectionsApi) {
    var attributes = ['picture', 'picture.image_href', 'approval_state', 'created_on', 'description'];
    var filterValues = ['type=ServiceReconfigureRequest', 'or type=ServiceTemplateProvisionRequest'];
    var options = {expand: 'resources', attributes: attributes, filter: filterValues};

    return CollectionsApi.query('requests', options);
  }

  /** @ngInject */
  function resolveOrders(CollectionsApi) {
    return CollectionsApi.query('service_orders', {
      expand: ['resources', 'service_requests'],
      filter: ['state=ordered'],
    });
  }

  /** @ngInject */
  function StateController($state, requests, orders, RequestsState, OrdersState, $filter, $rootScope, lodash, Language) {
    var vm = this;

    vm.title = __('Request List');
    vm.requests = requests.resources;
    vm.requestsList = angular.copy(vm.requests);

    vm.orders = orders.resources;
    vm.ordersList = angular.copy(vm.orders);

    if (angular.isDefined($rootScope.notifications) && $rootScope.notifications.data.length > 0) {
      $rootScope.notifications.data.splice(0, $rootScope.notifications.data.length);
    }

    vm.listConfig = {
      selectItems: false,
      showSelectBox: false,
      selectionMatchProp: 'id',
      onClick: handleRequestClick,
    };

    vm.orderListConfig = {
      showSelectBox: false,
      selectionMatchProp: 'id',
      onClick: handleOrderClick,
    };

    vm.toolbarConfig = {
      filterConfig: {
        fields: [
           {
            id: 'description',
            title:  __('Description'),
            placeholder: __('Filter by Description'),
            filterType: 'text',
          },
          {
            id: 'request_id',
            title: __('Request ID'),
            placeholder: __('Filter by ID'),
            filterType: 'text',
          },
          {
            id: 'request_date',
            title: __('Request Date'),
            placeholder: __('Filter by Request Date'),
            filterType: 'text',
          },
          {
            id: 'approval_state',
            title: __('Request Status'),
            placeholder: __('Filter by Status'),
            filterType: 'select',
            filterValues: [__('Pending'), __('Denied'), __('Approved')],
          },
        ],
        resultsCount: vm.requestsList.length,
        appliedFilters: RequestsState.filterApplied ? RequestsState.getFilters() : [],
        onFilterChange: filterChange,
      },
      sortConfig: {
        fields: [
          {
            id: 'description',
            title: __('Description'),
            sortType: 'alpha',
          },
          {
            id: 'id',
            title: __('Request ID'),
            sortType: 'numeric',
          },
          {
            id: 'requested',
            title: __('Request Date'),
            sortType: 'numeric',
          },
          {
            id: 'status',
            title: __('Request Status'),
            sortType: 'alpha',
          },
        ],
        onSortChange: sortChange,
        isAscending: RequestsState.getSort().isAscending,
        currentField: RequestsState.getSort().currentField,
      },
    };

    vm.orderToolbarConfig = {
      filterConfig: {
        fields: [
           {
            id: 'name',
            title:  __('Name'),
            placeholder: __('Filter by Name'),
            filterType: 'text',
          },
          {
            id: 'id',
            title: __('Order ID'),
            placeholder: __('Filter by ID'),
            filterType: 'text',
          },
          {
            id: 'placed_at',
            title: __('Ordered Date'),
            placeholder: __('Filter by Ordered Date'),
            filterType: 'text',
          },
        ],
        resultsCount: vm.ordersList.length,
        appliedFilters: OrdersState.filterApplied ? OrdersState.getFilters() : [],
        onFilterChange: orderFilterChange,
      },
      sortConfig: {
        fields: [
          {
            id: 'name',
            title: __('Name'),
            sortType: 'alpha',
          },
          {
            id: 'id',
            title: __('Order ID'),
            sortType: 'numeric',
          },
          {
            id: 'placed_at',
            title: __('Ordered Date'),
            sortType: 'numeric',
          },
        ],
        onSortChange: orderSortChange,
        isAscending: OrdersState.getSort().isAscending,
        currentField: OrdersState.getSort().currentField
      }
    };

    if (RequestsState.filterApplied) {
      /* Apply the filtering to the data list */
      filterChange(RequestsState.getFilters());
      RequestsState.filterApplied = false;
    } else {
      applyFilters();
    }

    if (OrdersState.filterApplied) {
      orderFilterChange(OrdersState.getFilters());
      OrdersState.filterApplied = false;
    } else {
      orderApplyFilters();
    }

    function handleRequestClick(item, _e) {
      $state.go('requests.details', { requestId: item.id });
    }

    function handleOrderClick(item, _e) {
      $state.go('requests.order_details', { serviceOrderId: item.id });
    }

    function sortChange(sortId, direction) {
      vm.requestsList.sort(compareFn);

      /* Keep track of the current sorting state */
      RequestsState.setSort(sortId, vm.toolbarConfig.sortConfig.isAscending);
    }

    function orderSortChange(sortId, direction) {
      vm.ordersList.sort(orderCompareFn);

      /* Keep track of the current sorting state */
      OrdersState.setSort(sortId, vm.orderToolbarConfig.sortConfig.isAscending);
    }

    function compareFn(item1, item2) {
      var compValue = 0;
      if (vm.toolbarConfig.sortConfig.currentField.id === 'description') {
        compValue = item1.description.localeCompare(item2.description);
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'id') {
        compValue = item1.id - item2.id;
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'requested') {
        compValue = new Date(item1.created_on) - new Date(item2.created_on);
      } else if (vm.toolbarConfig.sortConfig.currentField.id === 'status') {
        compValue = item1.approval_state.localeCompare(item2.approval_state);
      }

      if (!vm.toolbarConfig.sortConfig.isAscending) {
        compValue = compValue * -1;
      }

      return compValue;
    }

    function orderCompareFn(item1, item2) {
      var compValue = 0;
      if (vm.orderToolbarConfig.sortConfig.currentField.id === 'name') {
        compValue = item1.name.localeCompare(item2.name);
      } else if (vm.orderToolbarConfig.sortConfig.currentField.id === 'id') {
        compValue = item1.id - item2.id;
      } else if (vm.orderToolbarConfig.sortConfig.currentField.id === 'placed_at') {
        compValue = new Date(item1.placed_at || item1.updated_at) - new Date(item2.placed_at || item2.updated_at);
      }

      if (!vm.orderToolbarConfig.sortConfig.isAscending) {
        compValue = compValue * -1;
      }

      return compValue;
    }

    function filterChange(filters) {
      applyFilters(filters);
      vm.toolbarConfig.filterConfig.resultsCount = vm.requestsList.length;
    }

    function orderFilterChange(filters) {
      orderApplyFilters(filters);
      vm.orderToolbarConfig.filterConfig.resultsCount = vm.ordersList.length;
    }

    function applyFilters(filters) {
      vm.requestsList = [];
      if (filters && filters.length > 0) {
        angular.forEach(vm.requests, filterChecker);
      } else {
        vm.requestsList = vm.requests;
      }

      /* Keep track of the current filtering state */
      RequestsState.setFilters(filters);

      /* Make sure sorting direction is maintained */
      sortChange(RequestsState.getSort().currentField, RequestsState.getSort().isAscending);

      function filterChecker(item) {
        if (matchesFilters(item, filters, requestMatchesFilter)) {
          vm.requestsList.push(item);
        }
      }
    }

    function orderApplyFilters(filters) {
      vm.ordersList = [];
      if (filters && filters.length > 0) {
        angular.forEach(vm.orders, filterChecker);
      } else {
        vm.ordersList = vm.orders;
      }

      /* Keep track of the current filtering state */
      OrdersState.setFilters(filters);

      /* Make sure sorting direction is maintained */
      orderSortChange(OrdersState.getSort().currentField, OrdersState.getSort().isAscending);

      function filterChecker(item) {
        if (matchesFilters(item, filters, orderMatchesFilter)) {
          vm.ordersList.push(item);
        }
      }
    }

    function matchesFilters(item, filters, matchesFilter) {
      var matches = true;
      angular.forEach(filters, filterMatcher);

      function filterMatcher(filter) {
        if (!matchesFilter(item, filter)) {
          matches = false;

          return false;
        }
      }

      return matches;
    }

    function requestMatchesFilter(item, filter) {
      if (filter.id === 'description') {
        return item.description.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      } else if (filter.id === 'approval_state') {
        var value;
        if (lodash.lastIndexOf([__('Pending'), 'Pending'], filter.value) > -1) {
          value = "pending_approval";
        } else if (lodash.lastIndexOf([__('Denied'), 'Denied'], filter.value) > -1) {
          value = "denied";
        } else if (lodash.lastIndexOf([__('Approved'), 'Approved'], filter.value) > -1) {
          value = "approved";
        }

        return item.approval_state === value;
      } else if (filter.id === 'request_id') {
        return String(item.id).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      } else if (filter.id === 'request_date') {
        return $filter('date')(item.created_on).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      }

      return false;
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

    Language.fixState(RequestsState, vm.toolbarConfig);
    Language.fixState(OrdersState, vm.orderToolbarConfig);
  }
})();

import templateUrl from './request-explorer.html';

export const RequestExplorerComponent = {
  templateUrl,
  controller: ComponentController,
  controllerAs: 'vm',
};

/** @ngInject */
function ComponentController($state, CollectionsApi, RequestsState, ListView, $filter, lodash, Language, EventNotifications,
                             ModalService, Polling) {
  var vm = this;

  vm.$onInit = function() {
    angular.extend(vm, {
      title: __('Request Explorer'),
      listData: [],
      listDataCopy: [],
      loading: true,
      requestCount: 0,
      limit: 20,
      offset: 0,
      selectedItemsList: [],
      limitOptions: [5, 10, 20, 50, 100, 200, 500, 1000],
      listConfig: {
        selectionMatchProp: 'id',
        onCheckBoxChange: selectItem,
        onClick: handleRequestClick,
      },
      toolbarConfig: {
        actionsConfig: {
          actionsInclude: true,
        },
        filterConfig: {
          fields: getRequestFilterFields(),
          resultsCount: vm.listDataCopy ? vm.listDataCopy.length : 0,
          appliedFilters: RequestsState.filterApplied ? RequestsState.getFilters() : [],
          onFilterChange: filterChange,
        },
        sortConfig: {
          fields: getRequestSortFields(),
          onSortChange: sortChange,
          isAscending: RequestsState.getSort().isAscending,
          currentField: RequestsState.getSort().currentField,
        },
      },
      footerConfig: {
        actionsConfig: {
          actionsInclude: true,
        },
      },
      configuration: [
        {
          title: __('Lifecycle'),
          actionName: 'lifecycle',
          icon: 'fa fa-recycle',
          actions: [],
          isDisabled: false,
        },
      ],
      listActionDisable: listActionDisable,
      pollingInterval: 10000,
      paginationUpdate: paginationUpdate,
    });

    vm.configuration[0].actions = [
      {
        icon: 'fa fa-check',
        name: __('Approve'),
        actionName: 'approve',
        title: __('Approve'),
        actionFn: approveRequests,
        isDisabled: false,
      }, {
        icon: 'fa fa-ban',
        name: __('Deny'),
        actionName: 'deny',
        title: __('Deny'),
        actionFn: denyRequests,
        isDisabled: false,
      },
    ];

    vm.fetchData = fetchData;
    vm.fetchData(vm.limit, 0);

    if (RequestsState.filterApplied) {
      /* Apply the filtering to the data list */
      filterChange(RequestsState.getFilters());
      RequestsState.filterApplied = false;
    } else {
      applyFilters();
    }

    Language.fixState(RequestsState, vm.toolbarConfig);
    Polling.start('requestsListPolling', pollUpdateRequestsList, vm.pollingInterval);
    vm.$onDestroy = function() {
      Polling.stop('requestsListPolling');
    };
  };

  // Private

  function fetchData(limit, offset, _refresh) {
    var filter = [];
    var attributes = ['picture', 'picture.image_href', 'approval_state', 'created_on', 'description', 'requester_name'];
    var options = {
      expand: 'resources',
      limit: limit,
      offset: String(offset),
      attributes: attributes,
      filter: filter,
    };

    if (vm.toolbarConfig.filterConfig.appliedFilters) {
      lodash.forEach(lodash.groupBy(vm.toolbarConfig.filterConfig.appliedFilters, 'id'), processFilters);
    }

    CollectionsApi.query('requests', {hide: 'resources', filter: filter}).then(handleSuccess, handleError);
    CollectionsApi.query('requests', options).then(handleSuccess, handleError);

    function handleSuccess(response) {
      if (angular.isDefined(response.resources)) {
        var responseData = response.resources; // vm.selectedItemsList
        if (vm.selectedItemsList.length > 0) {
          responseData.forEach(function(item) {
            var selectedItem = lodash.find(vm.selectedItemsList, {id: item.id});
            if (angular.isDefined(selectedItem)) {
              item.selected = true;
            }
          });
        }
        vm.listData = responseData;
        vm.listDataCopy = angular.copy(vm.listData);
        vm.loading = false;
      } else {
        vm.requestCount = response.subcount;
        vm.toolbarConfig.filterConfig.resultsCount = vm.requestCount;
      }
    }

    function handleError() {
      vm.loading = false;
      EventNotifications.error(__('There was an error loading the requests.'));
    }

    function processFilters(value) {
      var count = 0;
      lodash.forEach(value, pushFilterValue);

      function pushFilterValue(item) {
        count >= 1 ? options.filter.push('or ' + item.id + '=' + item.value) : options.filter.push(item.id + '=' + item.value);
        count++;
      }
    }
  }

  function getRequestFilterFields() {
    var statuses = [__('pending_approval'), __('denied'), __('approved')];

    return [
      ListView.createFilterField('description', __('Description'), __('Filter by Description'), 'text'),
      ListView.createFilterField('id', __('Request ID'), __('Filter by Request ID'), 'text'),
      ListView.createFilterField('requester_name', __('Requester'), __('Filter by Requester'), 'text'),
      ListView.createFilterField('created_on', __('Request Date'), __('Filter by Request Date'), 'text'),
      ListView.createFilterField('approval_state', __('Request Status'), __('Filter by Status'), 'select', statuses),
    ];
  }

  function getRequestSortFields() {
    return [
      ListView.createSortField('description', __('Description'), 'alpha'),
      ListView.createSortField('id', __('Request ID'), 'numeric'),
      ListView.createSortField('requester_name', __('Requester'), 'alpha'),
      ListView.createSortField('requested', __('Request Date'), 'numeric'),
      ListView.createSortField('status', __('Request Status'), 'alpha'),
    ];
  }

  function handleRequestClick(item, _e) {
    $state.go('requests.details', {requestId: item.id});
  }

  function sortChange(sortId, _direction) {
    vm.listDataCopy.sort(compareFn);

    /* Keep track of the current sorting state */
    RequestsState.setSort(sortId, vm.toolbarConfig.sortConfig.isAscending);
  }

  function compareFn(item1, item2) {
    var compValue = 0;
    if (vm.toolbarConfig.sortConfig.currentField.id === 'description') {
      compValue = item1.description.localeCompare(item2.description);
    } else if (vm.toolbarConfig.sortConfig.currentField.id === 'id') {
      compValue = item1.id - item2.id;
    } else if (vm.toolbarConfig.sortConfig.currentField.id === 'requester_name') {
      compValue = item1.requester_name.localeCompare(item2.requester_name);
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

  function filterChange(filters) {
    applyFilters(filters);
    vm.toolbarConfig.filterConfig.resultsCount = vm.listDataCopy.length;
  }

  function applyFilters(filters) {
    vm.selectedItemsList = [];
    vm.listDataCopy = ListView.applyFilters(filters, vm.listDataCopy, vm.listData, RequestsState, requestMatchesFilter);
    vm.fetchData(vm.limit, 0);

    /* Make sure sorting direction is maintained */
    sortChange(RequestsState.getSort().currentField, RequestsState.getSort().isAscending);
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
    } else if (filter.id === 'requester_name') {
      return String(item.requester_name).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
    } else if (filter.id === 'created_on') {
      return $filter('date')(item.created_on).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
    }

    return false;
  }

  function selectItem(item) {
    lodash.indexOf(vm.selectedItemsList, item) === -1 ? vm.selectedItemsList.push(item) : lodash.pull(vm.selectedItemsList, item);
    vm.selectedItemsListCount = vm.selectedItemsList.length;
  }

  function approveRequests() {
    var modalOptions = {
      component: 'processRequestsModal',
      resolve: {
        requests: function() {
          return vm.selectedItemsList;
        },
        modalType: function() {
          return lodash.find(vm.selectedItemsList, isPending) ? 'invalid' : "approve";
        },
      },
    };
    ModalService.open(modalOptions);
  }

  function denyRequests() {
    var modalOptions = {
      component: 'processRequestsModal',
      resolve: {
        requests: function() {
          return vm.selectedItemsList;
        },
        modalType: function() {
          return lodash.find(vm.selectedItemsList, isPending) ? 'invalid' : "deny";
        },
      },
    };
    ModalService.open(modalOptions);
  }

  function isPending(item) {
    return item.approval_state === 'approved' || item.approval_state === 'denied';
  }

  function listActionDisable(config, items) {
    items.length <= 0 ? config.isDisabled = true : config.isDisabled = false;
  }

  function pollUpdateRequestsList() {
    vm.fetchData(vm.limit, vm.offset, true);
  }

  function paginationUpdate(limit, offset) {
    vm.limit = limit;
    vm.offset = offset;
    vm.fetchData(limit, offset);
  }
}

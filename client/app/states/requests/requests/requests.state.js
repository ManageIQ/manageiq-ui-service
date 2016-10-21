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
      'requests.requests': {
        parent: 'application',
        url: '/requests/requests',
        templateUrl: 'app/states/requests/requests/requests.html',
        controller: RequestsController,
        controllerAs: 'vm',
        title: N_('Requests'),
        resolve: {
          requests: resolveRequests,
        },
      },
    };
  }

  /** @ngInject */
  function resolveRequests(CollectionsApi) {
    var attributes = ['picture', 'picture.image_href', 'approval_state', 'created_on', 'description', 'requester_name'];
    var filterValues = ['type=ServiceReconfigureRequest', 'or type=ServiceTemplateProvisionRequest'];
    var options = {expand: 'resources', attributes: attributes, filter: filterValues};

    return CollectionsApi.query('requests', options);
  }

  /** @ngInject */
  function RequestsController($state, requests, RequestsState, ListView, $filter, lodash, Language) {
    var vm = this;
    vm.title = __('Requests');
    vm.requests = requests.resources;
    vm.requestsList = angular.copy(vm.requests);

    vm.listConfig = {
      selectItems: false,
      showSelectBox: false,
      selectionMatchProp: 'id',
      onClick: handleRequestClick,
    };

    var requestFilterConfig = {
      fields: getRequestFilterFields(),
      resultsCount: vm.requestsList.length,
      appliedFilters: RequestsState.filterApplied ? RequestsState.getFilters() : [],
      onFilterChange: filterChange,
    };

    var requestSortConfig = {
      fields: getRequestSortFields(),
      onSortChange: sortChange,
      isAscending: RequestsState.getSort().isAscending,
      currentField: RequestsState.getSort().currentField,
    };

    vm.toolbarConfig = {
      filterConfig: requestFilterConfig,
      sortConfig: requestSortConfig,
    };

    if (RequestsState.filterApplied) {
      /* Apply the filtering to the data list */
      filterChange(RequestsState.getFilters());
      RequestsState.filterApplied = false;
    } else {
      applyFilters();
    }

    function getRequestFilterFields() {
      var statuses = [__('Pending'), __('Denied'), __('Approved')];

      return [
        ListView.createFilterField('description',    'Description',    'Filter by Description',  'text'),
        ListView.createFilterField('request_id',     'Request ID',     'Filter by Request ID',   'text'),
        ListView.createFilterField('requester_name', 'Requester',      'Filter by Requester',    'text'),
        ListView.createFilterField('request_date',   'Request Date',   'Filter by Request Date', 'text'),
        ListView.createFilterField('approval_state', 'Request Status', 'Filter by Status',       'select', statuses),
      ];
    }

    function getRequestSortFields() {
      return [
        ListView.createSortField('description',    'Description',    'alpha'),
        ListView.createSortField('id',             'Request ID',     'numeric'),
        ListView.createSortField('requester_name', 'Requester',      'alpha'),
        ListView.createSortField('requested',      'Request Date',   'numeric'),
        ListView.createSortField('status',         'Request Status', 'alpha'),
      ];
    }

    function handleRequestClick(item, _e) {
      $state.go('requests.requests.details', { requestId: item.id });
    }

    function sortChange(sortId, direction) {
      vm.requestsList.sort(compareFn);

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
      vm.toolbarConfig.filterConfig.resultsCount = vm.requestsList.length;
    }

    function applyFilters(filters) {
      vm.requestsList = ListView.applyFilters(filters, vm.requestsList, vm.requests, RequestsState, requestMatchesFilter);

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
      } else if (filter.id === 'request_date') {
        return $filter('date')(item.created_on).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
      }

      return false;
    }

    Language.fixState(RequestsState, vm.toolbarConfig);
  }
})();

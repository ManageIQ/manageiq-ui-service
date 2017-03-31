import '../../../assets/sass/_explorer.sass';
import templateUrl from './request-explorer.html';

export const RequestExplorerComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  templateUrl,
};

/** @ngInject */
function ComponentController($state, RequestsState, ListView, lodash, Language, EventNotifications,
                             ModalService, Polling) {
  const vm = this;

  vm.$onDestroy = function() {
    Polling.stop('requestsListPolling');
  };

  vm.$onInit = function() {
    vm.permissions = RequestsState.getPermissions();
    RequestsState.listActions.setSort(RequestsState.listActions.getSort().currentField, false);
    $state.params.filter ? RequestsState.listActions.setFilters($state.params.filter) : RequestsState.listActions.setFilters([]);

    angular.extend(vm, {
      title: __('Request Explorer'),
      listData: [],
      loading: true,
      filterCount: 0,
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
          resultsCount: 0,
          appliedFilters: RequestsState.listActions.getFilters(),
          onFilterChange: filterChange,
        },
        sortConfig: {
          fields: getRequestSortFields(),
          onSortChange: sortChange,
          isAscending: RequestsState.listActions.getSort().isAscending,
          currentField: RequestsState.listActions.getSort().currentField,
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
          name: __('Lifecycle'),
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
    if (vm.permissions.approval) {
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
    }

    fetchData(vm.limit, 0);

    Language.fixState(RequestsState.listActions, vm.toolbarConfig);
    Polling.start('requestsListPolling', pollUpdateRequestsList, vm.pollingInterval);
  };

  // Private

  function fetchData(limit, offset, refresh) {
    vm.loading = !refresh;

    RequestsState.get(limit, offset).then(handleSuccess, handleError);

    function handleSuccess(response) {
      vm.loading = false;
      vm.selectedItemsList = [];
      vm.listData = response.resources;

      RequestsState.getMinimal().then((response) => {
        vm.toolbarConfig.filterConfig.resultsCount = response.subcount;
        vm.filterCount = response.subcount;
      });
    }

    function handleError() {
      vm.loading = false;
      EventNotifications.error(__('There was an error loading the requests.'));
    }
  }

  function getRequestFilterFields() {
    const statuses = [__('pending_approval'), __('denied'), __('approved')];

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
      ListView.createSortField('created_on', __('Request Date'), 'numeric'),
      ListView.createSortField('status', __('Request Status'), 'alpha'),
    ];
  }

  function handleRequestClick(item, _e) {
    $state.go('requests.details', {requestId: item.id});
  }

  function sortChange(sortId, direction) {
    RequestsState.listActions.setSort(sortId, direction);
    fetchData(vm.limit, 0);
  }

  function filterChange(filters) {
    RequestsState.listActions.setFilters(filters);
    fetchData(vm.limit, 0);
  }

  function selectItem(item) {
    lodash.indexOf(vm.selectedItemsList, item) === -1 ? vm.selectedItemsList.push(item) : lodash.pull(vm.selectedItemsList, item);
    vm.selectedItemsListCount = vm.selectedItemsList.length;
  }

  function approveRequests() {
    const modalOptions = {
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
    const modalOptions = {
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
    fetchData(vm.limit, vm.offset, true);
  }

  function paginationUpdate(limit, offset) {
    vm.limit = limit;
    vm.offset = offset;
    fetchData(limit, offset);
  }
}

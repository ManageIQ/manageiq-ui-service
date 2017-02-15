/* eslint camelcase: "off" */
export const TemplateExplorerComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  templateUrl: 'app/components/template-explorer/template-explorer.html',
};
/*
 * list of srtuff left to do
 * implement filter
 *  implement polling
 *  implement menu actions
 *  implement row actions
 */
/** @ngInject */
function ComponentController($filter, lodash, ListView, Language, OrchestrationTemplates, EventNotifications, Session, RBAC, ModalService,
                             CollectionsApi, sprintf, Polling, $log) {
  const vm = this;
  vm.$onInit = activate();
  vm.$onDestroy = function() {
    Polling.stop('orderListPolling');
  };

  function activate() {
    angular.extend(vm, {
      currentUser: Session.currentUser(),
      loading: false,
      templates: [],
      limit: 20,
      filterCount: 0,
      filters:[],
      templatesList: [],
      selectedItemsList: [],
      limitOptions: [5, 10, 20, 50, 100, 200, 500, 1000],
      selectedItemsListCount: 0,
      // Functions
      resolveTemplates: resolveTemplates,
      listActionDisable: listActionDisable,
      updatePagination: updatePagination,
      // Config setup
      actionConfig: getActionConfig(),
      menuActions: getMenuActions(),
      toolbarConfig: getToolbarConfig(),
      listConfig: getListConfig(),
      sortConfig: getSortConfig(),
      offset: 0,
      pollingInterval: 10000,
    });

    resolveTemplates(vm.limit, 0);
  //  Polling.start('orderListPolling', pollUpdateOrderList, vm.pollingInterval);
  }

  function getActionConfig() {
    return [
     /* {
        title: __('Lifecycle'),
        actionName: 'lifecycle',
        name: __('Lifecycle'),
        icon: 'fa fa-recycle',
        actions: [
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
        ],
      },*/
    ];
  }

  function getListConfig() {
    return {
      showSelectBox: checkApproval(),
      useExpandingRows: false,
      selectionMatchProp: 'id',
    //  onCheckBoxChange: selectionChange,
    };
  }
  function getSortConfig() {
    return {
      direction: 'asc',
      field: 'name',
      sortOptions: 'alpha',
    };
  }
  function getToolbarConfig() {
    var sortOrderFields = getOrderSortFields();
    const sortConfig = {
      fields: sortOrderFields,
      onSortChange: sortChange,
      isAscending: true,
      currentField: sortOrderFields[0],
    };

    const filterConfig = {
      fields: getOrderFilterFields(),
      resultsCount: 0,
      appliedFilters: [],
      onFilterChange: filterChange,
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
      ListView.createFilterField('type', __('Type'), __('Filter by Type'), 'text'),
      ListView.createFilterField('draft', __('Draft'), __('Filter by Draft'), 'text'),
  //    ListView.createFilterField('placed_at', __('Order Date'), __('Filter by Order Date'), 'text'),
    ];
  }

  function getOrderSortFields() {
    return [
      ListView.createSortField('name', __('Name'), 'alpha'),
      ListView.createSortField('type', __('Type'), 'alpha'),
    ];
  }

  function getMenuActions() {
    const menuActions = [
      {
        name: __('Duplicate'),
        actionName: 'duplicate',
        title: __('Duplicate Order'),
        actionFn: duplicateOrder,
        isDisabled: false,
      }, {
        name: __('Remove'),
        actionName: 'remove',
        title: __('Remove Order'),
        actionFn: removeOrder,
        isDisabled: false,
      }];

    return checkApproval() ? menuActions : null;
  }

  function sortChange(sortId, direction) {
    vm.sortConfig.field = sortId.id;
    vm.sortConfig.direction = direction === true ? 'asc' : 'desc';
    vm.sortConfig.sortOptions = sortId.sortType === 'alpha' ? 'ignore_case' : '';

    resolveTemplates(vm.limit, 0);
  }
  function filterChange(filters){
      vm.filters = filters;
      console.log(filters);
    resolveTemplates(vm.limit, 0);
  }
  function resolveTemplates(limit, offset, refresh) {
    if (!refresh) {
      vm.loading = true;
    }
    var existingOrders = (angular.isDefined(vm.ordersList) && refresh ? angular.copy(vm.ordersList) : []);

    vm.offset = offset;

    var filter = vm.filters;
    var attributes = [];
    var options = {
      expand: 'resources',
      limit: limit,
      offset: String(offset),
      attributes: attributes,
      filter: filter,
      sort_by: vm.sortConfig.field,
      sort_options: vm.sortConfig.sortOptions,
      sort_order: vm.sortConfig.direction,
    };
    $log.info(options);
/*    if (vm.toolbarConfig.filterConfig.appliedFilters) {
      lodash.forEach(lodash.groupBy(vm.toolbarConfig.filterConfig.appliedFilters, 'id'), processFilters);
    }*/

    CollectionsApi.query('orchestration_templates', {hide: 'resources', filter: filter}).then(querySuccess, queryFailure);
    CollectionsApi.query('orchestration_templates', options).then(querySuccess, queryFailure);

    function querySuccess(response) {
      vm.loading = false;

      vm.selectedItemsList = [];
      vm.toolbarConfig.filterConfig.resultsCount = vm.filterCount;


      if (angular.isDefined(response.resources)) {
        vm.templates = [];
        vm.templates = response.resources;

        vm.loading = false;
      } else {
        vm.requestCount = response.subcount;
        vm.filterCount = response.subcount;
        vm.toolbarConfig.filterConfig.resultsCount = vm.requestCount;
      }

      function refreshRow(item) {
        for (var i = 0; i < existingOrders.length; i++) {
          var currentOrder = existingOrders[i];
          if (currentOrder.id === item.id) {
            item.selected = (angular.isDefined(currentOrder.selected) ? currentOrder.selected : false);
            item.isExpanded = (angular.isDefined(currentOrder.isExpanded) ? currentOrder.isExpanded : false);
            if (item.selected) {
              vm.selectedItemsList.push(item);
            }
            existingOrders.splice(i, 1);
            break;
          }
        }

        return item;
      }
    }

    function queryFailure(error) {
      vm.loading = false;
      EventNotifications.error(__('There was an error loading orders.'));
    }
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

  function checkApproval() {
    return lodash.reduce(lodash.map(['miq_request_approval', 'miq_request_admin'], RBAC.has));
  }

  function isPending(item) {
    return item.approval_state === 'approved' || item.approval_state === 'denied';
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
    vm.resolveTemplates(limit, offset);
  }
  function duplicateOrder() {

  }
  function removeOrder() {

  }
  Language.fixState(OrchestrationTemplates, vm.toolbarConfig);
}

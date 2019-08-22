/* eslint camelcase: "off", comma-dangle: 0 */
import '../../../assets/sass/_explorer.sass'
import templateUrl from './service-explorer.html'

export const ServiceExplorerComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  templateUrl
}

/** @ngInject */
function ComponentController ($state, ServicesState, Language, ListView, Chargeback, TaggingService, TagEditorModal,
                              EventNotifications, ModalService, PowerOperations, lodash, Polling, POLLING_INTERVAL) {
  const vm = this

  vm.$onDestroy = function () {
    Polling.stop('serviceListPolling')
  }

  vm.$onInit = () => {
    vm.permissions = ServicesState.getPermissions()
    $state.params.filter ? ServicesState.services.setFilters($state.params.filter) : ServicesState.services.setFilters([])
    ServicesState.services.setSort({id: 'created_at', title: 'Created', sortType: 'numeric'}, false)

    TaggingService.queryAvailableTags().then(
      (response) => { vm.toolbarConfig.filterConfig.fields = getServiceFilterFields(response) }).catch(
      () => { vm.toolbarConfig.filterConfig.fields = defaultFilterFields() }
    )

    angular.extend(vm, {
      loading: false,
      title: __('Services'),
      services: [],
      limit: 20,
      servicesList: [],
      selectedItemsList: [],
      limitOptions: [5, 10, 20, 50, 100, 200, 500, 1000],
      // Functions
      resolveServices: resolveServices,
      actionEnabled: actionEnabled,
      updateMenuActionForItemFn: updateMenuActionForItemFn,
      listActionDisable: listActionDisable,
      isAnsibleService: isAnsibleService,
      viewService: viewService,
      startService: startService,
      stopService: stopService,
      suspendService: suspendService,
      paginationUpdate: paginationUpdate,
      defaultFilterFields: defaultFilterFields,
      // Config setup
      cardConfig: getCardConfig(),
      listConfig: getListConfig(),
      listActions: getListActions(),
      toolbarConfig: {
        sortConfig: serviceSortConfig(),
        filterConfig: serviceFilterConfig(),
        actionsConfig: {
          actionsInclude: true
        }
      },
      menuActions: getMenuActions(),
      serviceChildrenListConfig: createServiceChildrenListConfig(),
      pollingInterval: POLLING_INTERVAL
    })
    vm.offset = 0

    Language.fixState(ServicesState.services, vm.toolbarConfig)

    resolveServices(vm.limit, 0)

    vm.checkAll = {
      checked: false,
      trigger: selectAllToggle,
    }
  }

  function getCardConfig () {
    return {
      multiSelect: true,
      selectionMatchProp: 'id',
      onCheckBoxChange: handleSelectionChange,
      onClick: viewService
    }
  }

  function getListConfig () {
    return {
      useExpandingRows: true,
      selectionMatchProp: 'id',
      onCheckBoxChange: handleSelectionChange,
      onClick: viewService
    }
  }

  function handleSelectionChange () {
    vm.selectedItemsList = vm.servicesList.filter((service) => service.selected)
    vm.toolbarConfig.filterConfig.selectedCount = vm.selectedItemsList.length

    vm.checkAll = Object.assign({}, vm.checkAll, {
      checked: vm.selectedItemsList.length === vm.servicesList.length,
    })
  }

  function selectAllToggle (value) {
    vm.servicesList.forEach((service) => {
      service.selected = value
    })

    handleSelectionChange()
  }

  function isAnsibleService (service) {
    var compareValue = angular.isDefined(service.type) ? service.type : service.name

    return compareValue ? compareValue.toLowerCase().includes('ansible') : false
  }

  function getListActions () {
    var configActions, lifeCycleActions, policyActions
    var listActions = []

    lifeCycleActions = ServicesState.getLifeCycleCustomDropdown(setServiceRetirement, retireService)
    if (lifeCycleActions) {
      listActions.push(lifeCycleActions)
    }

    policyActions = ServicesState.getPolicyCustomDropdown(editTags)
    if (policyActions) {
      listActions.push(policyActions)
    }

    configActions = ServicesState.getConfigurationCustomDropdown(editService, removeServices, setOwnership)
    if (configActions) {
      listActions.push(configActions)
    }

    return listActions
  }

  function actionEnabled (actionName, item) {
    var enabled = true
    switch (actionName) {
      case 'start':
        enabled = PowerOperations.allowStartService(item)
        break
      case 'stop':
        enabled = PowerOperations.allowStopService(item)
        break
      case 'suspend':
        enabled = PowerOperations.allowSuspendService(item)
        break
    }

    return enabled
  }

  function updateMenuActionForItemFn (action, item) {
    switch (action.actionName) {
      case 'start':
        action.isVisible = !isAnsibleService(item)
        break
      case 'stop':
        action.isVisible = !isAnsibleService(item)
        break
      case 'suspend':
        action.isVisible = !isAnsibleService(item)
        break
      case 'powerOperationsDivider':
        action.isVisible = !isAnsibleService(item)
        break
    }
    action.isDisabled = !actionEnabled(action.actionName, item)
  }

  function startService (_action, item) {
    PowerOperations.startService(item)
  }

  function stopService (_action, item) {
    PowerOperations.stopService(item)
  }

  function suspendService (_action, item) {
    PowerOperations.suspendService(item)
  }

  function pollUpdateServicesList () {
    resolveServices(vm.limit, vm.offset, true)
  }

  function serviceFilterConfig () {
    return {
      fields: [],
      resultsCount: 0,
      totalCount: 0,
      selectedCount: 0,
      appliedFilters: ServicesState.services.getFilters() || [],
      onFilterChange: filterChange,
      itemsLabel: __('Result'),
      itemsLabelPlural: __('Results'),
    }
  }

  function serviceSortConfig () {
    return {
      fields: getServiceSortFields(),
      onSortChange: sortChange,
      isAscending: ServicesState.services.getSort().isAscending,
      currentField: ServicesState.services.getSort().currentField
    }
  }

  function createServiceChildrenListConfig () {
    return {
      showSelectBox: false,
      onClick: viewService
    }
  }

  function getMenuActions () {
    const menu = []
    let showPowerMenu = false
    if (vm.permissions.powerOn || vm.permissions.powerOff || vm.permissions.suspend) {
      showPowerMenu = true
    }
    const menuOptions = [
      {
        name: __('Edit'),
        actionName: 'edit',
        title: __('Edit Service'),
        actionFn: editServiceItem,
        isDisabled: false,
        permission: vm.permissions.edit
      },
      {
        name: __('Edit Tags'),
        actionName: 'editTags',
        title: __('Edit Tags'),
        actionFn: editTagsItem,
        isDisabled: false,
        permission: vm.permissions.editTags
      },
      {
        name: __('Set Ownership'),
        actionName: 'ownership',
        title: __('Set Ownership'),
        actionFn: setOwnershipItem,
        isDisabled: false,
        permission: vm.permissions.setOwnership
      },
      {
        name: __('Retire'),
        actionName: 'retireService',
        title: __('Retire Service'),
        actionFn: retireServiceItem,
        isDisabled: false,
        permission: vm.permissions.retire
      },
      {
        name: __('Set Retirement'),
        actionName: 'setServiceRetirement',
        title: __('Set Retirement Dates'),
        actionFn: setServiceRetirementItem,
        isDisabled: false,
        permission: vm.permissions.setRetireDate
      },
      {
        name: __('Remove'),
        actionName: 'remove',
        title: __('Remove Service'),
        actionFn: removeServicesItem,
        isDisabled: false,
        permission: vm.permissions.delete
      },
      {
        actionName: 'powerOperationsDivider',
        isSeparator: true,
        permission: showPowerMenu
      },
      {
        name: __('Start'),
        actionName: 'start',
        title: __('Start this service'),
        actionFn: startService,
        isDisabled: false,
        permission: vm.permissions.serviceStart
      },
      {
        name: __('Stop'),
        actionName: 'stop',
        title: __('Stop this service'),
        actionFn: stopService,
        isDisabled: false,
        permission: vm.permissions.serviceStop
      },
      {
        name: __('Suspend'),
        actionName: 'suspend',
        title: __('Suspend this service'),
        actionFn: suspendService,
        isDisabled: false,
        permission: vm.permissions.serviceSuspend
      }
    ]

    angular.forEach(menuOptions, hasPermission)

    function hasPermission (item) {
      if (item.permission) {
        menu.push(item)
      }
    }

    return menu
  }

  function sortChange (sortId, isAscending) {
    ServicesState.services.setSort(sortId, isAscending)
    resolveServices(vm.limit, 0)
  }

  function viewService (item, ev) {
    $state.go('services.details', {serviceId: item.id})
    ev.stopImmediatePropagation()
  }

  // Private
  function filterChange (filters) {
    if (filters.length) {
      const latestFilter = filters[filters.length - 1]

      if (latestFilter.id === 'tags.name') {
        lodash.remove(filters, (item) => item.value.filterCategory)
        filters.push(latestFilter)
      }
    }

    ServicesState.services.setFilters(filters)
    resolveServices(vm.limit, 0)
  }

  function defaultFilterFields () {
    return [ListView.createFilterField('name', __('Name'), __('Filter by Name'), 'text'),
      ListView.createFilterField('description', __('Description'), __('Filter by Description'), 'text')]
  }

  function getServiceFilterFields (tags) {
    const filterValues = []
    const filterCategories = {}

    tags.forEach((tag) => {
      const displayName = tag.categorization.displayName

      if (tag.name.match(/\//g).length === 2) {
        filterValues.push({title: displayName.substr(-displayName.lastIndexOf(':')), id: tag.name})
        filterCategories[`${tag.name}`] = {
          id: tag.name,
          title: displayName.substr(-displayName.lastIndexOf(':')),
          filterValues: []
        }
      }
      if (tag.name.match(/\//g).length === 3) {
        filterCategories[tag.name.substring(-1, tag.name.lastIndexOf('/'))]
        .filterValues
        .push({
          title: displayName.substr(displayName.lastIndexOf(':') + 1),
          id: tag.name.substr(tag.name.lastIndexOf('/') + 1)
        })
      }
    })

    const filterFields = defaultFilterFields()
    filterFields.push(
      ListView.createGenericField(
        {
          id: 'tags.name',
          title: __('Tags'),
          placeholder: __('Filter by Tag Category'),
          filterType: 'complex-select',
          filterMultiselect: true,
          filterValues: filterValues,
          filterDelimiter: '/',
          filterCategoriesPlaceholder: __('Filter by Tag Value'),
          filterCategories: filterCategories
        }
      )
    )
    return filterFields
  }

  function getServiceSortFields () {
    return [
      ListView.createSortField('created_at', __('Created'), 'numeric'),
      ListView.createSortField('name', __('Name'), 'alpha'),
      ListView.createSortField('retires_on', __('Retirement Date'), 'numeric')
    ]
  }

  function resolveServices (limit, offset, refresh) {
    Polling.stop('serviceListPolling')
    vm.loading = !refresh
    vm.offset = offset

    ServicesState.getServices(
      limit,
      offset,
      refresh).then(querySuccess, queryFailure)

    function querySuccess (result) {
      vm.toolbarConfig.filterConfig.resultsCount = result.subquery_count
      Polling.start('serviceListPolling', pollUpdateServicesList, vm.pollingInterval)
      vm.services = []
      var existingServices = (angular.isDefined(vm.servicesList) && refresh ? angular.copy(vm.servicesList) : [])
      vm.selectedItemsList = []
      vm.toolbarConfig.filterConfig.totalCount = result.subcount
      vm.toolbarConfig.filterConfig.selectedCount = 0

      result.resources.forEach((item) => {
        if (angular.isUndefined(item.service_id)) {
          item.disableRowExpansion = item.all_service_children.length < 1
          item.power_state = PowerOperations.getPowerState(item)
          item.power = getPowerInfo(item.power_state)
          angular.forEach(item.all_service_children, function (childService) {
            childService.power_state = PowerOperations.getPowerState(item)
            childService.power = getPowerInfo(childService.power_state)
          })

          if (refresh) {
            for (var i = 0; i < existingServices.length; i++) {
              var currentService = existingServices[i]
              if (currentService.id === item.id) {
                item.selected = (angular.isDefined(currentService.selected) ? currentService.selected : false)
                item.isExpanded = (angular.isDefined(currentService.isExpanded) ? currentService.isExpanded : false)
                if (item.selected) {
                  vm.selectedItemsList.push(item)
                }
                existingServices.splice(i, 1)
                break
              }
            }
          }
          vm.services.push(item)
        }
      })
      vm.services.forEach(Chargeback.processReports)
      Chargeback.adjustRelativeCost(vm.services)
      vm.servicesList = angular.copy(vm.services)
      vm.loading = false
    }

    function getPowerInfo (powerState) {
      const powerStates = {
        'on': {icon: 'pficon-ok', tooltip: __('Power State: On')},
        'off': {icon: 'fa-power-off', tooltip: __('Power State: Off')},
        'unknown': {icon: 'fa-question-circle', tooltip: __('Power State: Unknown')}
      }

      return (powerState !== 'on' && powerState !== 'off' ? powerStates.unknown : powerStates[powerState])
    }

    function queryFailure (response) {
      vm.loading = false
      EventNotifications.error(__('There was an error loading the services. ') + response.data.error.message)
    }
  }

  function listActionDisable (config, items) {
    config.isDisabled = items.length <= 0
    if (config.actionName === 'configuration') {
      if (items.length > 1) {
        lodash.forEach(config.actions, disableItems)
      } else {
        lodash.forEach(config.actions, enableItems)
      }
    }

    function disableItems (item) {
      if (item.actionName === 'edit') {
        item.isDisabled = true
      }
    }

    function enableItems (item) {
      if (item.actionName === 'edit') {
        item.isDisabled = false
      }
    }
  }

  function doEditService (service) {
    var modalOptions = {
      component: 'editServiceModal',
      resolve: {
        service: function () {
          return service
        }
      }
    }
    ModalService.open(modalOptions)
  }

  function doEditTags (services) {
    var extractSharedTagsFromSelectedServices =
      lodash.partial(TaggingService.findSharedTags, services)

    var launchTagEditorForSelectedServices =
      lodash.partial(TagEditorModal.showModal, services)

    return TaggingService.queryAvailableTags()
    .then(extractSharedTagsFromSelectedServices)
    .then(launchTagEditorForSelectedServices)
  }

  function doRemoveServices (services) {
    var modalOptions = {
      component: 'retireRemoveServiceModal',
      resolve: {
        services: function () {
          return services
        },
        modalType: function () {
          return 'remove'
        }
      }
    }
    ModalService.open(modalOptions)
  }

  function doSetOwnership (services) {
    var modalOptions = {
      component: 'ownershipServiceModal',
      resolve: {
        services: function () {
          return services
        },
        users: resolveUsers,
        groups: resolveGroups
      }
    }

    ModalService.open(modalOptions)

    /** @ngInject */
    function resolveUsers (CollectionsApi) {
      var options = {expand: 'resources', attributes: ['userid', 'name'], sort_by: 'name', sort_options: 'ignore_case'}

      return CollectionsApi.query('users', options)
    }

    /** @ngInject */
    function resolveGroups (CollectionsApi) {
      var options = {
        expand: 'resources',
        attributes: ['description'],
        sort_by: 'description',
        sort_options: 'ignore_case'
      }

      return CollectionsApi.query('groups', options)
    }
  }

  function doSetServiceRetirement (services) {
    var modalOptions = {
      component: 'retireServiceModal',
      resolve: {
        services: function () {
          return services
        }
      }
    }
    ModalService.open(modalOptions)
  }

  function doRetireService (services) {
    var modalOptions = {
      component: 'retireRemoveServiceModal',
      resolve: {
        services: function () {
          return services
        },
        modalType: function () {
          return 'retire'
        }
      }
    }
    ModalService.open(modalOptions)
  }

  function paginationUpdate (limit, offset) {
    vm.limit = limit
    vm.offset = offset
    vm.resolveServices(limit, offset)
  }

  function editService () {
    doEditService(vm.selectedItemsList[0])
  }

  function editTags () {
    doEditTags(vm.selectedItemsList)
  }

  function removeServices () {
    doRemoveServices(vm.selectedItemsList)
  }

  function setOwnership () {
    doSetOwnership(vm.selectedItemsList)
  }

  function setServiceRetirement () {
    doSetServiceRetirement(vm.selectedItemsList)
  }

  function retireService () {
    doRetireService(vm.selectedItemsList)
  }

  function editServiceItem (_action, item) {
    doEditService(item)
  }

  function editTagsItem (_action, item) {
    doEditTags([item])
  }

  function removeServicesItem (_action, item) {
    doRemoveServices([item])
  }

  function setOwnershipItem (_action, item) {
    doSetOwnership([item])
  }

  function setServiceRetirementItem (_action, item) {
    doSetServiceRetirement([item])
  }

  function retireServiceItem (_action, item) {
    doRetireService([item])
  }
}

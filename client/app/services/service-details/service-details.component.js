/* eslint camelcase: "off", comma-dangle: 0 */
import './_service-details.sass'
import templateUrl from './service-details.html'

export const ServiceDetailsComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  templateUrl,
  bindings: {}
}

/** @ngInject */
function ComponentController ($stateParams, $state, $window, CollectionsApi, EventNotifications, Chargeback, Consoles,
                              TagEditorModal, ModalService, PowerOperations, ServicesState, TaggingService, lodash,
                              Polling, LONG_POLLING_INTERVAL) {
  const vm = this
  vm.$onInit = activate
  vm.$onDestroy = onDestroy

  function onDestroy () {
    Polling.stop('servicesPolling')
  }

  function activate () {
    vm.permissions = ServicesState.getPermissions()

    angular.extend(vm, {
      serviceId: $stateParams.serviceId,
      loading: true,
      title: __('Service Details'),
      service: {},
      availableTags: [],
      credential: {},
      listActions: [],
      emptyState: {icon: 'pficon pficon-help', title: __('No data available')},
      // Functions
      hasCustomButtons: hasCustomButtons,
      disableStopButton: disableStopButton,
      disableSuspendButton: disableSuspendButton,
      disableStartButton: disableStartButton,
      toggleOpenResourceGroup: toggleOpenResourceGroup,
      toggleOpenGenericObjects: toggleOpenGenericObjects,
      openCockpit: openCockpit,
      openConsole: openConsole,
      processSnapshot: processSnapshot,
      startVM: startVM,
      stopVM: stopVM,
      suspendVM: suspendVM,
      retireVM: retireVM,
      retireVMFlag: false,
      gotoComputeResource: gotoComputeResource,
      gotoService: gotoService,
      gotoCatalogItem: gotoCatalogItem,
      getGenericObjects: getGenericObjects,
      genericObjectsTypeViewState: {},
      genericObjectsViewState: {},
      setGenericObjectViewState: setGenericObjectViewState,
      createResourceGroups: createResourceGroups,
      // Config setup
      headerConfig: getHeaderConfig(),
      resourceListConfig: {
        showSelectBox: false,
        checkDisabled: isResourceDisabled
      }
    })
    fetchResources(vm.serviceId, {
      isAutoRefresh: false,
      runAutomate: false,
    })
    Polling.start('servicesPolling', startPollingService, LONG_POLLING_INTERVAL)
  }

  function startPollingService () {
    fetchResources(vm.serviceId, {
      isAutoRefresh: true,
      runAutomate: false,
    })
  }

  function fetchResources (id, options) {
    ServicesState.getService(id, options).then(handleSuccess, handleFailure)

    function handleSuccess (response) {
      vm.service = response
      vm.service.credential = []
      vm.title = vm.service.name
      getListActions()
      Chargeback.processReports(vm.service)
      vm.computeGroup = vm.createResourceGroups(vm.service)
      vm.genericObjects = (angular.isDefined(vm.service.generic_objects) ? vm.getGenericObjects(vm.service.generic_objects) : [])
      TaggingService.queryAvailableTags('services/' + id + '/tags/').then((response) => {
        vm.availableTags = response
      })
      vm.loading = false
    }

    function handleFailure (response) {
      EventNotifications.error(__('There was an error fetching this service. ') + response)
    }
  }

  function getGenericObjects (objects) {
    let genericObjects = {}
    objects.forEach((object) => {
      const genericObjectType = object.generic_object_definition_id
      let objectTypeViewState = false
      let objectViewState = false

      if (angular.isDefined(vm.genericObjectsTypeViewState[genericObjectType])) {
        objectTypeViewState = vm.genericObjectsTypeViewState[genericObjectType]
      } else {
        vm.genericObjectsTypeViewState[genericObjectType] = objectTypeViewState
      }

      if (angular.isDefined(vm.genericObjectsViewState[object.id])) {
        objectViewState = vm.genericObjectsViewState[object.id]
      }

      if (!genericObjects[genericObjectType]) {
        genericObjects[genericObjectType] = {
          name: object.generic_object_definition.name,
          isExpanded: objectTypeViewState,
          id: genericObjectType,
          objects: []
        }
      }
      const properties = []
      for (var property in object.properties) {
        if (property !== 'services') {
          properties.push({key: property, value: object.properties[property]})
        }
      }
      object.isExpanded = objectViewState
      object.properties = lodash.chunk(properties, 3)
      genericObjects[genericObjectType].objects.push(object)
    })

    const sortedObjects = []
    lodash(genericObjects).keys().sort().each((key) => {
      const tmpGenericObjectType = genericObjects[key]
      sortedObjects.push(tmpGenericObjectType)
    })

    return sortedObjects
  }

  function setGenericObjectViewState (object) {
    vm.genericObjectsViewState[object.id] = object.isExpanded
  }

  function hasCustomButtons (service) {
    const actions = service.custom_actions || {}
    const groups = actions.button_groups || []
    const buttons = [].concat(actions.buttons, ...groups.map((g) => g.buttons))

    return lodash.compact(buttons).length
  }

  function getListActions () {
    const lifeCycleActions = ServicesState.getLifeCycleCustomDropdown(setServiceRetirement, retireService)
    const configActions = ServicesState.getConfigurationCustomDropdown(editService, removeService, setOwnership)
    const policyActions = ServicesState.getPolicyCustomDropdown(editTags)
    const listActions = []

    if (angular.isUndefined(vm.service.type)) {
      const powerOptionsMenu = {
        title: __('Power Operations'),
        actionName: 'powerOperations',
        icon: 'fa fa-power-off',
        actions: [],
        isDisabled: false,
        tooltipText: __('Power Operations')
      }
      const powerOptionsActions = [
        {
          name: __('Start'),
          actionName: 'start',
          title: __('Start the Service'),
          actionFn: startService,
          permission: vm.permissions.serviceStart,
          isDisabled: disableStartButton(vm.service)
        }, {
          name: __('Stop'),
          actionName: 'stop',
          title: __('Stop the Service'),
          actionFn: stopService,
          permission: vm.permissions.serviceStop,
          isDisabled: disableStopButton(vm.service)
        }, {
          name: __('Suspend'),
          actionName: 'suspend',
          title: __('Suspend the Service'),
          actionFn: suspendService,
          permission: vm.permissions.serviceSuspend,
          isDisabled: disableSuspendButton(vm.service)
        }
      ]
      angular.forEach(powerOptionsActions, (menuOption) => {
        if (menuOption.permission) {
          powerOptionsMenu.actions.push(menuOption)
        }
      })
      if (powerOptionsMenu.actions.length > 0) {
        listActions.push(powerOptionsMenu)
      }
    }

    if (lifeCycleActions) {
      listActions.push(lifeCycleActions)
    }

    if (policyActions) {
      listActions.push(policyActions)
    }

    if (configActions) {
      if (angular.isDefined(lodash.find(vm.service.actions, {'name': 'reconfigure'})) && vm.permissions.reconfigure) {
        configActions.actions.push(
          {
            icon: 'fa fa-cog',
            name: __('Reconfigure'),
            actionName: 'reconfigure',
            title: __('Reconfigure the Service'),
            actionFn: reconfigureService,
            isDisabled: false
          }
        )
      }
      listActions.push(configActions)
    }

    vm.listActions = listActions
  }

  function disableStartButton (item) {
    return !PowerOperations.allowStartService(item)
  }

  function disableStopButton (item) {
    return !PowerOperations.allowStopService(item)
  }

  function disableSuspendButton (item) {
    return !PowerOperations.allowSuspendService(item)
  }

  function startService () {
    PowerOperations.startService(vm.service)
    getListActions()
  }

  function stopService () {
    PowerOperations.stopService(vm.service)
    getListActions()
  }

  function suspendService () {
    PowerOperations.suspendService(vm.service)
    getListActions()
  }

  function getHeaderConfig () {
    return {
      actionsConfig: {
        actionsInclude: true
      }
    }
  }

  function editService () {
    const modalOptions = {
      component: 'editServiceModal',
      resolve: {
        service: function () {
          return vm.service
        }
      }
    }
    ModalService.open(modalOptions)
  }

  function editTags () {
    TagEditorModal.showModal(vm.service, vm.availableTags)
  }

  function removeService () {
    CollectionsApi.delete('services', vm.service.id).then(removeSuccess, removeFailure)

    function removeSuccess () {
      EventNotifications.success(vm.service.name + __(' was removed.'))
      $state.go('services')
    }

    function removeFailure (_data) {
      EventNotifications.error(__('There was an error removing this service.'))
    }
  }

  function setOwnership () {
    const modalOptions = {
      component: 'ownershipServiceModal',
      resolve: {
        services: function () {
          return [vm.service]
        },
        users: resolveUsers,
        groups: resolveGroups
      }
    }

    ModalService.open(modalOptions)

    /** @ngInject */
    function resolveUsers (CollectionsApi) {
      const options = {
        expand: 'resources',
        attributes: ['userid', 'name'],
        sort_by: 'name',
        sort_options: 'ignore_case'
      }

      return CollectionsApi.query('users', options)
    }

    /** @ngInject */
    function resolveGroups (CollectionsApi) {
      const options = {
        expand: 'resources',
        attributes: ['description'],
        sort_by: 'description',
        sort_options: 'ignore_case'
      }

      return CollectionsApi.query('groups', options)
    }
  }

  function reconfigureService () {
    $state.go('services.reconfigure', {serviceId: vm.service.id})
  }

  function setServiceRetirement () {
    const modalOptions = {
      component: 'retireServiceModal',
      resolve: {
        services: function () {
          return [vm.service]
        }
      }
    }
    ModalService.open(modalOptions)
  }

  function retireService () {
    var modalOptions = {
      component: 'retireRemoveServiceModal',
      resolve: {
        services: function () {
          return [vm.service]
        },
        modalType: function () {
          return 'retire'
        }
      }
    }
    ModalService.open(modalOptions)
  }

  function createResourceGroups (service) {
    return {
      title: __('Compute'),
      open: true,
      resourceTypeClass: 'pficon pficon-screen',
      emptyMessage: __('There are no Compute Resources for this service.'),
      resources: service.vms || []
    }
  }

  function toggleOpenResourceGroup (group) {
    group.open = !group.open
  }

  function toggleOpenGenericObjects (object) {
    object.isExpanded = !object.isExpanded
    vm.genericObjectsTypeViewState[object.id] = object.isExpanded
  }

  function openConsole (item) {
    if (item.supported_consoles.vnc.visible && item.supported_consoles.vnc.enabled) {
      Consoles.open(item.id)
    }
  }

  function openCockpit (item) {
    if (item.supported_consoles.cockpit.visible && item.supported_consoles.cockpit.enabled) {
      $window.open('http://' + item.ipaddresses[0] + ':9090')
    }
  }

  function gotoComputeResource (resource) {
    $state.go('services.resource-details', {serviceId: vm.serviceId, vmId: resource.id})
  }

  function startVM (item, isDisabled) {
    if (!isDisabled) {
      PowerOperations.startVm(item)
    }
  }

  function stopVM (item, isDisabled) {
    if (!isDisabled) {
      PowerOperations.stopVm(item)
    }
  }

  function suspendVM (item, isDisabled) {
    if (!isDisabled) {
      PowerOperations.suspendVm(item)
    }
  }

  function retireVM (item, isDisabled) {
    if (!isDisabled) {
      PowerOperations.retireVM(item)
    }
  }

  function gotoCatalogItem () {
    $state.go('catalogs.details', {serviceTemplateId: vm.service.service_template.id})
  }

  function gotoService (service) {
    $state.go('services.details', {serviceId: service.id})
  }

  function isResourceDisabled (item) {
    return item.retired
  }

  function processSnapshot (item) {
    const modalOptions = {
      component: 'processSnapshotsModal',
      resolve: {
        vm: () => item,
        modalType: () => 'create'
      },
      size: 'lg'
    }
    ModalService.open(modalOptions)
  }
}

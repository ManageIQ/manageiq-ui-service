/* eslint camelcase: "off" */
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
                              Polling, LONG_POLLING_INTERVAL, $templateCache) {
  const vm = this
  vm.$onInit = activate
  vm.$onDestroy = onDestroy

  function onDestroy () {
    Polling.stop('servicesPolling')
  }

  function activate () {
    vm.permissions = ServicesState.getPermissions()

 // const test = `
    //          <div class="btn-group dropdown-kebab-pf" uib-dropdown dropdown-append-to-body
    //                      ng-if="$ctrl.customScope.permissions.vm_snapshot_add || $ctrl.customScope.permissions.viewSnapshots">
    //                   <button type="button" class="btn btn-default" uib-dropdown-toggle
    //                           type="button">
    //                           <i class="fa fa-camera"></i>
    //                           <span translate>Snapshots</span>
    //                     <span class="caret"></span>
    //                   </button>
    //                   <ul class="dropdown-menu dropdown-menu-right" uib-dropdown-menu role="menu"
    //                       aria-labelledby="btn-append-to-to-body">
    //                     <li role="menuitem" ng-if="$ctrl.customScope.permissions.viewSnapshots">
    //                       <a ui-sref="vms.snapshots({vmId: item.id})" translate>View</a>
    //                     </li>
    //                     <li role="menuitem" ng-if="$ctrl.customScope.permissions.vm_snapshot_add">
    //                       <a ng-click="$ctrl.customScope.processSnapshot(item)" translate>Create</a>
    //                     </li>
    //                   </ul>
    //                 </div>
    // `
    const test = `
             <div  uib-dropdown dropdown-append-to-body
                         ng-if="$ctrl.customScope.permissions.vm_snapshot_add || $ctrl.customScope.permissions.viewSnapshots">
                      <div type="button"  uib-dropdown-toggle
                              type="button">
                              <i class="fa fa-camera"></i>
                              <span translate>Snapshots</span>
                        <span class="caret"></span>
                      </div>
                      <ul class="dropdown-menu dropdown-menu-right" uib-dropdown-menu role="menu"
                          aria-labelledby="btn-append-to-to-body">
                        <li role="menuitem" ng-if="$ctrl.customScope.permissions.viewSnapshots">
                          <a ui-sref="vms.snapshots({vmId: item.id})" translate>View</a>
                        </li>
                        <li role="menuitem" ng-if="$ctrl.customScope.permissions.vm_snapshot_add">
                          <a ng-click="$ctrl.customScope.processSnapshot(item)" translate>Create</a>
                        </li>
                      </ul>
                    </div>
    `
    $templateCache.put('snapshotsActionButton',test)

    angular.extend(vm, {
      serviceId: $stateParams.serviceId,
      loading: true,
      title: __('Service Details'),
      service: {},
      availableTags: [],
      credential: {},
      listActions: [],
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
      },
      resourceActionButtons: [{
        // name: 'Snapshots',
        // class: 'btn btn-default',
        include: 'snapshotsActionButton'
      }, {
        name: 'Access',
        class: 'btn btn-default',
      }],
      resourceMenuActions: [
        {
          name: 'Start',
        }, {
          name: 'Stop',
        }, {
          name: 'Suspend',
        }, {
          name: 'Retire',
        }, {
          name: 'seperator',
          isSeparator: true
        }, {
          name: 'View Details',
        }
      ]
    })
    fetchResources(vm.serviceId)
    Polling.start('servicesPolling', startPollingService, LONG_POLLING_INTERVAL)
  }

  function startPollingService () {
    fetchResources(vm.serviceId, true)
  }

  function fetchResources (id, refresh) {
    ServicesState.getService(id, refresh).then(handleSuccess, handleFailure)

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

    return lodash.compact(buttons).length > 0
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
    const data = {action: 'retire'}
    CollectionsApi.post('services', vm.service.id, {}, data).then(retireSuccess, retireFailure)

    function retireSuccess () {
      EventNotifications.success(vm.service.name + __(' was retired.'))
      $state.go('services')
    }

    function retireFailure () {
      EventNotifications.error(__('There was an error retiring this service.'))
    }
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
    if (item['supports_console?'] && item.power_state === 'on') {
      Consoles.open(item.id)
    }
  }

  function openCockpit (item) {
    if (item['supports_cockpit?'] && item.power_state === 'on') {
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

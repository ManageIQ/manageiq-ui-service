/* eslint-disable camelcase */

/** @ngInject */
export function PowerOperationsFactory (CollectionsApi, EventNotifications, sprintf) {
  var service = {
    startService: startService,
    stopService: stopService,
    suspendService: suspendService,
    allowStartService: allowStart,
    allowStopService: allowStop,
    allowSuspendService: allowSuspend,
    startVm: startVm,
    stopVm: stopVm,
    suspendVm: suspendVm,
    retireVM: retireVm,
    allowStartVm: allowStart,
    allowStopVm: allowStop,
    allowSuspendVm: allowSuspend,
    getPowerState: getPowerState,
    powerOperationUnknownState: powerOperationUnknownState,
    powerOperationInProgressState: powerOperationInProgressState,
    powerOperationOnState: powerOperationOnState,
    powerOperationOffState: powerOperationOffState,
    powerOperationSuspendState: powerOperationSuspendState,
    powerOperationTimeoutState: powerOperationTimeoutState,
    powerOperationStartTimeoutState: powerOperationStartTimeoutState,
    powerOperationStopTimeoutState: powerOperationStopTimeoutState,
    powerOperationSuspendTimeoutState: powerOperationSuspendTimeoutState
  }

  function powerStatesMatch (powerStates, match) {
    var matches = angular.isArray(powerStates) && powerStates.length > 0

    angular.forEach(powerStates, function (powerState) {
      matches = matches && (powerState === match)
    })

    return matches
  }

  function allowStart (item) {
    return powerOperationUnknownState(item) ||
      powerOperationOffState(item) ||
      powerOperationSuspendState(item) ||
      powerOperationTimeoutState(item)
  }

  function allowStop (item) {
    return !powerOperationUnknownState(item) &&
      !powerOperationOffState(item)
  }

  function allowSuspend (item) {
    return !powerOperationUnknownState(item) &&
      !powerOperationSuspendState(item)
  }

  function getPowerState (item) {
    var powerState = ''
    if (angular.isDefined(item.power_state)) {
      powerState = item.power_state
    } else if (angular.isArray(item.power_states)) {
      if (powerStatesMatch(item.power_states, 'on')) {
        powerState = 'on'
      } else if (powerStatesMatch(item.power_states, 'off')) {
        powerState = 'off'
      } else if (powerStatesMatch(item.power_states, 'timeout')) {
        powerState = 'timeout'
      }
    }

    return powerState
  }

  function powerOperationUnknownState (item) {
    return getPowerState(item) === ''
  }

  function powerOperationInProgressState (item) {
    return !powerOperationTimeoutState(item) &&
      ((item.power_status === 'starting') ||
      (item.power_status === 'stopping') ||
      (item.power_status === 'suspending'))
  }

  function powerOperationOnState (item) {
    return getPowerState(item) === 'on'
  }

  function powerOperationOffState (item) {
    return getPowerState(item) === 'off'
  }

  function powerOperationSuspendState (item) {
    return getPowerState(item) === 'suspended'
  }

  function powerOperationTimeoutState (item) {
    return getPowerState(item) === 'timeout'
  }

  function powerOperationStartTimeoutState (item) {
    return powerOperationTimeoutState(item) && item.power_status === 'starting'
  }

  function powerOperationStopTimeoutState (item) {
    return powerOperationTimeoutState(item) && item.power_status === 'stopping'
  }

  function powerOperationSuspendTimeoutState (item) {
    return powerOperationTimeoutState(item) && item.power_status === 'suspending'
  }

  function startService (item) {
    item.power_state = ''
    item.power_status = 'starting'

    return servicePowerOperation('start', item);
  }

  function stopService (item) {
    item.power_state = ''
    item.power_status = 'stopping'

    return servicePowerOperation('stop', item);
  }

  function suspendService (item) {
    item.power_state = ''
    item.power_status = 'suspending'

    return servicePowerOperation('suspend', item);
  }

  function startVm (item) {
    item.power_state = ''
    item.power_status = 'starting'

    return vmPowerOperation('start', item);
  }

  function stopVm (item) {
    item.power_state = ''
    item.power_status = 'stopping'

    return vmPowerOperation('stop', item);
  }

  function suspendVm (item) {
    item.power_state = ''
    item.power_status = 'suspending'

    return vmPowerOperation('suspend', item);
  }

  function retireVm (item) {
    item.power_state = ''
    item.power_status = 'retiring'

    return vmPowerOperation('retire', item);
  }

  function powerOperation (apiType, powerAction, item, itemType) {
    return CollectionsApi.post(apiType, item.id, {}, {action: powerAction})
      .then(actionSuccess, actionFailure);

    function actionSuccess (response) {
      switch (powerAction) {
        case 'start':
          EventNotifications.success(sprintf(__('%s was started. %s'), item.name, response.message))
          break
        case 'stop':
          EventNotifications.success(sprintf(__('%s was stopped. %s'), item.name, response.message))
          break
        case 'suspend':
          EventNotifications.success(sprintf(__('%s was suspended. %s'), item.name, response.message))
          break
        case 'retire':
          EventNotifications.success(sprintf(__('%s was retired. %s'), item.name, response.message))
          break
      }
    }

    function actionFailure () {
      switch (powerAction) {
        case 'start':
          EventNotifications.error(sprintf(__('There was an error starting this %s.'), itemType))
          break
        case 'stop':
          EventNotifications.error(sprintf(__('There was an error stopping this %s.'), itemType))
          break
        case 'suspend':
          EventNotifications.error(sprintf(__('There was an error suspending this %s.'), itemType))
          break
        case 'retire':
          EventNotifications.error(sprintf(__('There was an error retiring this %s.'), itemType))
          break
      }
    }
  }

  function servicePowerOperation (powerAction, item) {
    return powerOperation('services', powerAction, item, 'service');
  }

  function vmPowerOperation (powerAction, item) {
    return powerOperation('vms', powerAction, item, 'virtual machine');
  }

  return service
}

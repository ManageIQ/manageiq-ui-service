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
      } else if (powerStatesMatch(item.power_states, 'suspended')) {
        powerState = 'suspended'
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

    return new Promise((resolve, reject) => {
      servicePowerOperation('start', item).then((results) => {
        resolve(results)
      })
    })
  }

  function stopService (item) {
    item.power_state = ''
    item.power_status = 'stopping'

    return new Promise((resolve, reject) => {
      servicePowerOperation('stop', item).then((results) => {
        resolve(results)
      })
    })
  }

  function suspendService (item) {
    item.power_state = ''
    item.power_status = 'suspending'

    return new Promise((resolve, reject) => {
      servicePowerOperation('suspend', item).then((results) => {
        resolve(results)
      })
    })
  }

  function startVm (item) {
    item.power_state = ''
    item.power_status = 'starting'

    return new Promise((resolve, reject) => {
      vmPowerOperation('start', item).then((results) => {
        resolve(results)
      })
    })
  }

  function stopVm (item) {
    item.power_state = ''
    item.power_status = 'stopping'

    return new Promise((resolve, reject) => {
      vmPowerOperation('stop', item).then((results) => {
        resolve(results)
      })
    })
  }

  function suspendVm (item) {
    item.power_state = ''
    item.power_status = 'suspending'

    return new Promise((resolve, reject) => {
      vmPowerOperation('suspend', item).then((results) => {
        resolve(results)
      })
    })
  }

  function retireVm (item) {
    item.power_state = ''
    item.power_status = 'retiring'

    return new Promise((resolve, reject) => {
      vmPowerOperation('retire', item).then((results) => {
        resolve(results)
      })
    })
  }

  function powerOperation (apiType, powerAction, item, itemType) {
    return new Promise((resolve, reject) => {
      resolve(CollectionsApi.post(apiType, item.id, {}, {action: powerAction}).then(actionSuccess, actionFailure))
    })
    function actionSuccess (response) {
      switch (powerAction) {
        case 'start':
          EventNotifications.success(sprintf(__('%s was started. ' + response.message), item.name))
          break
        case 'stop':
          EventNotifications.success(sprintf(__('%s was stopped. ' + response.message), item.name))
          break
        case 'suspend':
          EventNotifications.success(sprintf(__('%s was suspended. ' + response.message), item.name))
          break
        case 'retire':
          EventNotifications.success(sprintf(__('%s was retired. ' + response.message), item.name))
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
    return new Promise((resolve, reject) => {
      powerOperation('services', powerAction, item, 'service').then((result) => {
        resolve(result)
      })
    })
  }

  function vmPowerOperation (powerAction, item) {
    return new Promise((resolve, reject) => {
      powerOperation('vms', powerAction, item, 'virtual machine').then((result) => {
        resolve(result)
      })
    })
  }

  return service
}

/* eslint-disable camelcase */

/** @ngInject */
export function PowerOperationsFactory (CollectionsApi, EventNotifications, sprintf, lodash) {
  var service = {
    startService: startService,
    stopService: stopService,
    suspendService: suspendService,

    allowStartService: allowStart,
    allowStopService: allowStop,
    allowSuspendService: allowSuspend,

    allowStartVm: allowStart,
    allowStopVm: allowStop,
    allowSuspendVm: allowSuspend,

    getPowerState: getPowerState,
  }

  function powerStatesMatch (powerStates, match) {
    if (!powerStates || !powerStates.length) {
      return false
    }

    return lodash.every(powerStates, (powerState) => powerState === match)
  }

  function allowStart (item) {
    return ['', 'off', 'suspended', 'timeout'].includes(getPowerState(item))
  }

  function allowStop (item) {
    return !['', 'off'].includes(getPowerState(item))
  }

  function allowSuspend (item) {
    return !['', 'suspend'].includes(getPowerState(item))
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

  function servicePowerOperation (action, item) {
    return CollectionsApi.post('services', item.id, {}, { action })
      .then(actionSuccess, actionFailure);

    function actionSuccess (response) {
      switch (action) {
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
      switch (action) {
        case 'start':
          EventNotifications.error(__('There was an error starting this service.'))
          break
        case 'stop':
          EventNotifications.error(__('There was an error stopping this service.'))
          break
        case 'suspend':
          EventNotifications.error(__('There was an error suspending this service.'))
          break
        case 'retire':
          EventNotifications.error(__('There was an error retiring this service.'))
          break
      }
    }
  }

  return service
}

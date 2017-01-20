/* eslint-disable camelcase */

/** @ngInject */
export function PowerOperationsFactory(CollectionsApi, EventNotifications, sprintf) {
  var service = {
    startService: startService,
    stopService: stopService,
    suspendService: suspendService,
    getPowerState: getPowerState,
    powerOperationUnknownState: powerOperationUnknownState,
    powerOperationInProgressState: powerOperationInProgressState,
    powerOperationOnState: powerOperationOnState,
    powerOperationOffState: powerOperationOffState,
    powerOperationSuspendState: powerOperationSuspendState,
    powerOperationTimeoutState: powerOperationTimeoutState,
    powerOperationStartTimeoutState: powerOperationStartTimeoutState,
    powerOperationStopTimeoutState: powerOperationStopTimeoutState,
    powerOperationSuspendTimeoutState: powerOperationSuspendTimeoutState,
  };

  function powerStatesMatch(powerStates, match) {
    var matches = angular.isArray(powerStates) && powerStates.length > 0;

    angular.forEach(powerStates, function(powerState) {
      matches = matches && (powerState === match);
    });

    return matches;
  }

  function getPowerState(item) {
    var powerState = "";

    if (angular.isDefined(item.power_state)) {
      powerState = item.power_state;
    } else if (angular.isArray(item.power_states)) {
      if (powerStatesMatch(item.power_states, 'on')) {
        powerState = 'on';
      } else if (powerStatesMatch(item.power_states, 'off')) {
        powerState = 'off';
      } else if (powerStatesMatch(item.power_states, 'timeout')) {
        powerState = 'timeout';
      }
    }

    return powerState;
  }
  function powerOperationUnknownState(item) {
    return getPowerState(item) === "";
  }

  function powerOperationInProgressState(item) {
    return !powerOperationTimeoutState(item)
      && ((item.power_status === "starting")
      || (item.power_status === "stopping")
      || (item.power_status === "suspending"));
  }

  function powerOperationOnState(item) {
    return getPowerState(item) === 'on';
  }

  function powerOperationOffState(item) {
    return getPowerState(item) === 'off';
  }

  function powerOperationSuspendState(item) {
    return getPowerState(item) === 'off';
  }

  function powerOperationTimeoutState(item) {
    return getPowerState(item) === 'timeout';
  }

  function powerOperationStartTimeoutState(item) {
    return powerOperationTimeoutState(item) && item.power_status === "starting";
  }

  function powerOperationStopTimeoutState(item) {
    return powerOperationTimeoutState(item) && item.power_status === "stopping";
  }

  function powerOperationSuspendTimeoutState(item) {
    return powerOperationTimeoutState(item) && item.power_status === "suspending";
  }

  function startService(item) {
    item.power_state = '';
    item.power_status = 'starting';
    powerOperation('start', item);
  }

  function stopService(item) {
    item.power_state = '';
    item.power_status = 'stopping';
    powerOperation('stop', item);
  }

  function suspendService(item) {
    item.power_state = '';
    item.power_status = 'suspending';
    powerOperation('suspend', item);
  }

  function powerOperation(powerAction, item) {
    CollectionsApi.post('services', item.id, {}, {action: powerAction}).then(actionSuccess, actionFailure);

    function actionSuccess(response) {
      if (powerAction === 'start') {
        EventNotifications.success(sprintf(__("%s was started"), item.name));
      } else if (powerAction === 'stop') {
        EventNotifications.success(sprintf(__("%s was stopped"), item.name));
      } else if (powerAction === 'suspend') {
        EventNotifications.success(sprintf(__("%s was suspended"), item.name));
      }
    }

    function actionFailure() {
      if (powerAction === 'start') {
        EventNotifications.error(__('There was an error starting this service.'));
      } else if (powerAction === 'stop') {
        EventNotifications.error(__('There was an error stopping this service.'));
      } else if (powerAction === 'suspend') {
        EventNotifications.error(__('There was an error suspending this service.'));
      }
    }
  }

  return service;
}

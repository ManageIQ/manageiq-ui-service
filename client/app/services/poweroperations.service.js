/* eslint-disable camelcase */

(function() {
  'use strict';

  angular.module('app.services')
    .factory('PowerOperations', PowerOperationsFactory);

  /** @ngInject */
  function PowerOperationsFactory(CollectionsApi, EventNotifications, sprintf) {
    var service = {
      startService: startService,
      stopService: stopService,
      suspendService: suspendService,
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

    function powerOperationUnknownState(item) {
      return item.power_state === "" && item.options.power_status === "";
    }

    function powerOperationInProgressState(item) {
      return (item.power_state !== "timeout" && item.options.power_status === "starting")
        || (item.power_state !== "timeout" && item.options.power_status === "stopping")
        || (item.power_state !== "timeout" && item.options.power_status === "suspending");
    }

    function powerOperationOnState(item) {
      return item.power_state === "on" && item.options.power_status === "start_complete";
    }

    function powerOperationOffState(item) {
      return item.power_state === "off" && item.options.power_status === "stop_complete";
    }

    function powerOperationSuspendState(item) {
      return item.power_state === "off" && item.options.power_status === "suspend_complete";
    }

    function powerOperationTimeoutState(item) {
      return item.power_state === "timeout";
    }

    function powerOperationStartTimeoutState(item) {
      return item.power_state === "timeout" && item.options.power_status === "starting";
    }

    function powerOperationStopTimeoutState(item) {
      return item.power_state === "timeout" && item.options.power_status === "stopping";
    }

    function powerOperationSuspendTimeoutState(item) {
      return item.power_state === "timeout" && item.options.power_status === "suspending";
    }

    function startService(item) {
      item.power_state = '';
      item.options.power_status = 'starting';
      powerOperation('start', item);
    }

    function stopService(item) {
      item.power_state = '';
      item.options.power_status = 'stopping';
      powerOperation('stop', item);
    }

    function suspendService(item) {
      item.power_state = '';
      item.options.power_status = 'suspending';
      powerOperation('suspend', item);
    }

    function powerOperation(powerAction, item) {
      CollectionsApi.post('services', item.id, {}, {action: powerAction}).then(actionSuccess, actionFailure);

      function actionSuccess() {
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
})();

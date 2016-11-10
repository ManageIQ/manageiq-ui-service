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
      return item.powerState === "" && item.powerStatus === "";
    }

    function powerOperationInProgressState(item) {
      return (item.powerState !== "timeout" && item.powerStatus === "starting")
        || (item.powerState !== "timeout" && item.powerStatus === "stopping")
        || (item.powerState !== "timeout" && item.powerStatus === "suspending");
    }

    function powerOperationOnState(item) {
      return item.powerState === "on" && item.powerStatus === "start_complete";
    }

    function powerOperationOffState(item) {
      return item.powerState === "off" && item.powerStatus === "stop_complete";
    }

    function powerOperationSuspendState(item) {
      return item.powerState === "off" && item.powerStatus === "suspend_complete";
    }

    function powerOperationTimeoutState(item) {
      return item.powerState === "timeout";
    }

    function powerOperationStartTimeoutState(item) {
      return item.powerState === "timeout" && item.powerStatus === "starting";
    }

    function powerOperationStopTimeoutState(item) {
      return item.powerState === "timeout" && item.powerStatus === "stopping";
    }

    function powerOperationSuspendTimeoutState(item) {
      return item.powerState === "timeout" && item.powerStatus === "suspending";
    }

    function startService(item) {
      item.powerState = '';
      item.powerStatus = 'starting';
      powerOperation('start', item);
    }

    function stopService(item) {
      item.powerState = '';
      item.powerStatus = 'stopping';
      powerOperation('stop', item);
    }

    function suspendService(item) {
      item.powerState = '';
      item.powerStatus = 'suspending';
      powerOperation('suspend', item);
    }

    function powerOperation(powerAction, item) {
      CollectionsApi.post('services', item.id, {}, {action: powerAction}).then(actionSuccess, actionFailure);

      function actionSuccess() {
        if (powerAction === 'start') {
          EventNotifications.success(__(sprintf("%s was started", item.name)));
        } else if (powerAction === 'stop') {
          EventNotifications.success(__(sprintf("%s was stopped", item.name)));
        } else if (powerAction === 'suspend') {
          EventNotifications.success(__(sprintf("%s was suspended", item.name)));
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

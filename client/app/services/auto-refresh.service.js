/** @ngInject */
export function AutoRefreshFactory() {
  var callbacks = [];
  var service = {
    triggerAutoRefresh: triggerAutoRefresh,
    listenForAutoRefresh: listenForAutoRefresh,
    callbacks: callbacks,
  };

  function triggerAutoRefresh(data) {
    angular.forEach(callbacks, (function(callback) {
      callback(data);
    }));
  }

  function listenForAutoRefresh(allDialogFields, autoRefreshableDialogFields, url, resourceId, refreshCallback) {
    var nextFieldToRefresh = function(field, data, currentIndex) {
      return (field.auto_refresh === true && data.initializingIndex !== currentIndex && data.currentIndex < currentIndex);
    };

    var listenerFunction = function(data) {
      var autoRefreshOptions = {
        initializingIndex: data.initializingIndex,
      };

      var dialogFieldToRefresh = autoRefreshableDialogFields.filter(function(field, currentIndex) {
        if (nextFieldToRefresh(field, data, currentIndex)) {
          return field;
        }
      });

      if (dialogFieldToRefresh.length > 0) {
        dialogFieldToRefresh[0].beingRefreshed = true;
        dialogFieldToRefresh[0].triggerOverride = true;
        autoRefreshOptions.currentIndex = dialogFieldToRefresh[0].refreshableFieldIndex;
        refreshCallback(allDialogFields, dialogFieldToRefresh[0], url, resourceId, autoRefreshOptions);
      }
    };

    callbacks.push(listenerFunction);
  }

  return service;
}

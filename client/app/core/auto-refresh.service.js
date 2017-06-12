/** @ngInject */
export function AutoRefreshFactory() {
  const callbacks = [];
  const service = {
    triggerAutoRefresh: triggerAutoRefresh,
    listenForAutoRefresh: listenForAutoRefresh,
    callbacks: callbacks,
  };

  function triggerAutoRefresh(data) {
    callbacks.forEach((callback) => {
      callback(data);
    });
  }

  function listenForAutoRefresh(allDialogFields, autoRefreshableDialogFields, url, resourceId, refreshCallback) {
    const nextFieldToRefresh = function(field, data, currentIndex) {
      return (field.auto_refresh === true && data.initializingIndex !== currentIndex && data.currentIndex < currentIndex);
    };

    const listenerFunction = function(data) {
      const autoRefreshOptions = {
        initializingIndex: data.initializingIndex,
      };

      const dialogFieldToRefresh = autoRefreshableDialogFields.filter(function(field, currentIndex) {
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

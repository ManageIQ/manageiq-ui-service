/* eslint camelcase: "off" */
/* eslint angular/angularelement: "off" */

/** @ngInject */
export function DialogFieldListenerFactory(DialogFieldRefresh) {
  var service = {
    listenForAutoRefreshMessages: listenForAutoRefreshMessages,
  };

  return service;

  function listenForAutoRefreshMessages(allDialogFields, autoRefreshableDialogFields, url, resourceId) {
    var nextFieldToRefresh = function(field, data, currentIndex) {
      return (field.auto_refresh === true && data.initializingIndex !== currentIndex && data.currentIndex < currentIndex);
    };

    var listenerFunction = function(_event, data) {
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
        DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialogFieldToRefresh[0], url, resourceId, autoRefreshOptions);
      }
    };

    $(document).off('dialog::autoRefresh'); // Unbind all previous message listeners
    $(document).on('dialog::autoRefresh', listenerFunction);
  }
}

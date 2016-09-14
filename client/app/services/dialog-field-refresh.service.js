/* jshint -W117 */
(function() {
  'use strict';

  angular.module('app.services')
    .factory('DialogFieldRefresh', DialogFieldRefreshFactory);

  /** @ngInject */
  function DialogFieldRefreshFactory(CollectionsApi, EventNotifications) {
    var service = {
      listenForAutoRefreshMessages: listenForAutoRefreshMessages,
      refreshSingleDialogField: refreshSingleDialogField,
      setupDialogData: setupDialogData,
      triggerAutoRefresh: triggerAutoRefresh,
    };

    return service;

    function listenForAutoRefreshMessages(allDialogFields, autoRefreshableDialogFields, url, resourceId) {
      var listenerFunction = function(event) {
        var dialogFieldsToRefresh = autoRefreshableDialogFields.filter(function(fieldName) {
          if (event.originalEvent.data.fieldName !== fieldName) {
            return fieldName;
          }
        });

        allDialogFields.forEach(function(dialogField) {
          if (_.includes(dialogFieldsToRefresh, dialogField.name)) {
            dialogField.beingRefreshed = true;
          }
        });

        if (dialogFieldsToRefresh !== []) {
          refreshMultipleDialogFields(allDialogFields, dialogFieldsToRefresh, url, resourceId);
        }
      };

      $(window).off('message'); // Unbind all previous message listeners
      $(window).on('message', listenerFunction);
    }

    function refreshSingleDialogField(allDialogFields, dialogField, url, resourceId) {
      function refreshSuccess(result) {
        var resultObj = result.result[dialogField.name];

        updateAttributesForDialogField(dialogField, resultObj);
        triggerAutoRefresh(dialogField);
      }

      function refreshFailure(result) {
        EventNotifications.error('There was an error refreshing this dialog: ' + result);
      }

      dialogField.beingRefreshed = true;
      fetchDialogFieldInfo(allDialogFields, [dialogField.name], url, resourceId, refreshSuccess, refreshFailure);
    }

    function setupDialogData(dialogs, allDialogFields, autoRefreshableDialogFields) {
      angular.forEach(dialogs, function(dialog) {
        angular.forEach(dialog.dialog_tabs, function(dialogTab) {
          angular.forEach(dialogTab.dialog_groups, function(dialogGroup) {
            angular.forEach(dialogGroup.dialog_fields, function(dialogField) {
              allDialogFields.push(dialogField);
              if (dialogField.default_value === '' && dialogField.values !== '') {
                dialogField.default_value = dialogField.values;
              }

              if (typeof (dialogField.values) === 'object' && dialogField.default_value === undefined) {
                dialogField.default_value = String(dialogField.values[0][0]);
              }

              dialogField.triggerAutoRefresh = function() {
                triggerAutoRefresh(dialogField);
              };

              if (dialogField.auto_refresh === true) {
                autoRefreshableDialogFields.push(dialogField.name);
              }
            });
          });
        });
      });
    }

    function triggerAutoRefresh(dialogField) {
      if (dialogField.trigger_auto_refresh === true) {
        parent.postMessage({fieldName: dialogField.name}, '*');
      }
    }

    // Private

    function refreshMultipleDialogFields(allDialogFields, fieldNamesToRefresh, url, resourceId) {
      function refreshSuccess(result) {
        angular.forEach(allDialogFields, function(dialogField) {
          if (fieldNamesToRefresh.indexOf(dialogField.name) > -1) {
            var resultObj = result.result[dialogField.name];
            updateAttributesForDialogField(dialogField, resultObj);
          }
        });
      }

      function refreshFailure(result) {
        EventNotifications.error('There was an error automatically refreshing dialogs' + result);
      }

      fetchDialogFieldInfo(allDialogFields, fieldNamesToRefresh, url, resourceId, refreshSuccess, refreshFailure);
    }

    function updateAttributesForDialogField(dialogField, newDialogField) {
      copyDynamicAttributes(dialogField, newDialogField);

      if (typeof (newDialogField.values) === 'object') {
        dialogField.values = newDialogField.values;
        if (newDialogField.default_value !== undefined && newDialogField.default_value !== null) {
          dialogField.default_value = newDialogField.default_value;
        } else {
          dialogField.default_value = String(newDialogField.values[0][0]);
        }
      } else {
        if (dialogField.type === 'DialogFieldDateControl' || dialogField.type === 'DialogFieldDateTimeControl') {
          dialogField.default_value = new Date(newDialogField.values);
        } else {
          dialogField.default_value = newDialogField.values;
        }
      }

      dialogField.beingRefreshed = false;

      function copyDynamicAttributes(currentDialogField, newDialogField) {
        currentDialogField.data_type = newDialogField.data_type;
        currentDialogField.options   = newDialogField.options;
        currentDialogField.read_only = newDialogField.read_only;
        currentDialogField.required  = newDialogField.required;
      }
    }

    function fetchDialogFieldInfo(allDialogFields, dialogFieldsToFetch, url, resourceId, successCallback, failureCallback) {
      CollectionsApi.post(
        url,
        resourceId,
        {},
        JSON.stringify({
          action: 'refresh_dialog_fields',
          resource: {
            dialog_fields: dialogFieldInfoToSend(allDialogFields),
            fields: dialogFieldsToFetch,
          },
        })
      ).then(successCallback, failureCallback);
    }

    function dialogFieldInfoToSend(allDialogFields) {
      var fieldValues = {};
      angular.forEach(allDialogFields, function(dialogField) {
        fieldValues[dialogField.name] = dialogField.default_value;
      });

      return fieldValues;
    }
  }
})();

/* eslint camelcase: "off" */
/* eslint angular/angularelement: "off" */

/** @ngInject */
export function DialogFieldRefreshFactory(CollectionsApi, EventNotifications) {
  var service = {
    listenForAutoRefreshMessages: listenForAutoRefreshMessages,
    refreshSingleDialogField: refreshSingleDialogField,
    setupDialogData: setupDialogData,
    triggerAutoRefresh: triggerAutoRefresh,
  };

  return service;

  function listenForAutoRefreshMessages(allDialogFields, autoRefreshableDialogFields, url, resourceId) {
    var listenerFunction = function(event) {
      var dialogFieldToRefresh = autoRefreshableDialogFields.filter(function(field, currentIndex) {
        if (field.auto_refresh === true && event.originalEvent.data.refreshableFieldIndex < currentIndex) {
          return field;
        }
      });

      if (dialogFieldToRefresh.length > 0) {
        dialogFieldToRefresh[0].beingRefreshed = true;
        dialogFieldToRefresh[0].triggerOverride = true;
        refreshSingleDialogField(allDialogFields, dialogFieldToRefresh[0], url, resourceId);
      }
    };

    $(window).off('message'); // Unbind all previous message listeners
    $(window).on('message', listenerFunction);
  }

  function refreshSingleDialogField(allDialogFields, dialogField, url, resourceId) {
    function refreshSuccess(result) {
      var resultObj = result.result[dialogField.name];

      updateAttributesForDialogField(dialogField, resultObj);
      if (dialogField.type === 'DialogFieldDropDownList') {
        updateDialogSortOrder(dialogField);
      }
 
      triggerAutoRefresh(dialogField);
    }
    function updateDialogSortOrder(dialogField) {
      var values = dialogField.values;
      var sortDirection = dialogField.options.sort_order;
      var sortByValue = 0; // These are constants that are used to refer to array positions
      var sortByDescription = 1; // These are constants that are used to refer to array positions
      var sortBy = (dialogField.options.sort_by === 'value' ? sortByValue : sortByDescription);
      dialogField.values = values.sort((option1, option2) => {
        var trueValue = -1;
        var falseValue = 1;
        if (sortDirection !== 'ascending') {
          trueValue = 1;
          falseValue = -1;
        }

        return option2[sortBy] > option1[sortBy]  ? trueValue : falseValue;
      });
    }
    function refreshFailure(result) {
      EventNotifications.error('There was an error refreshing this dialog: ' + result);
    }

    dialogField.beingRefreshed = true;
    fetchDialogFieldInfo(allDialogFields, [dialogField.name], url, resourceId, refreshSuccess, refreshFailure);
  }

  function selectDefaultValue(dialogField, newDialogField) {
    if (angular.isObject(newDialogField.values)) {
      dialogField.values = newDialogField.values;
      if (angular.isDefined(newDialogField.default_value) && newDialogField.default_value !== null) {
        dialogField.default_value = newDialogField.default_value;
      } else {
        dialogField.default_value = newDialogField.values[0][0];
      }
    } else {
      if (dialogField.type === 'DialogFieldDateControl' || dialogField.type === 'DialogFieldDateTimeControl') {
        dialogField.default_value = new Date(newDialogField.values);
      } else {
        if (isBlank(newDialogField.default_value) || dialogField.type === 'DialogFieldCheckBox') {
          dialogField.default_value = newDialogField.values;
        }
      }
    }
    if (parseInt(dialogField.default_value, 10)) {
      dialogField.default_value = parseInt(dialogField.default_value, 10);
    }
  }

  function setupDialogData(dialogs, allDialogFields, autoRefreshableDialogFields) {
    angular.forEach(dialogs, function(dialog) {
      angular.forEach(dialog.dialog_tabs, function(dialogTab) {
        angular.forEach(dialogTab.dialog_groups, function(dialogGroup) {
          angular.forEach(dialogGroup.dialog_fields, function(dialogField) {
            allDialogFields.push(dialogField);

            selectDefaultValue(dialogField, dialogField);

            if (dialogField.auto_refresh === true || dialogField.trigger_auto_refresh === true) {
              dialogField.refreshableFieldIndex = autoRefreshableDialogFields.push(dialogField) - 1;
            }

            dialogField.triggerAutoRefresh = function() {
              triggerAutoRefresh(dialogField);
            };
          });
        });
      });
    });
  }

  function triggerAutoRefresh(dialogField) {
    if (dialogField.trigger_auto_refresh === true || dialogField.triggerOverride === true) {
      parent.postMessage({refreshableFieldIndex: dialogField.refreshableFieldIndex}, '*');
    }
  }

  // Private

  function updateAttributesForDialogField(dialogField, newDialogField) {
    copyDynamicAttributes(dialogField, newDialogField);
    selectDefaultValue(dialogField, newDialogField);

    dialogField.beingRefreshed = false;

    function copyDynamicAttributes(currentDialogField, newDialogField) {
      currentDialogField.data_type = newDialogField.data_type;
      currentDialogField.options = newDialogField.options;
      currentDialogField.read_only = newDialogField.read_only;
      currentDialogField.required = newDialogField.required;
      currentDialogField.visible = newDialogField.visible;
    }
  }

  function fetchDialogFieldInfo(allDialogFields, dialogFieldsToFetch, url, resourceId, successCallback, failureCallback) {
    CollectionsApi.post(
      url,
      resourceId,
      {},
      angular.toJson({
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

  function isBlank(value) {
    return angular.isUndefined(value)
      || value === null
      || value === '';
  }
}

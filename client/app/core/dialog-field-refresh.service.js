/* eslint camelcase: "off" */
/* eslint angular/angularelement: "off" */

/** @ngInject */
export function DialogFieldRefreshFactory (CollectionsApi) {
  var service = {
    refreshDialogField: refreshDialogField,
    setFieldValueDefaults: setFieldValueDefaults
  }

  return service

  function refreshDialogField (dialogData, dialogField, url, resourceId) {
    return new Promise((resolve, reject) => {
      CollectionsApi.post(
        url,
        resourceId,
        {},
        angular.toJson({
          action: 'refresh_dialog_fields',
          resource: {
            dialog_fields: dialogData,
            fields: dialogField
          }
        })
      ).then((response) => {
        resolve(response.result[dialogField])
      }).catch((response) => {
        reject(response)
      })
    })
  }

  function setFieldValueDefaults (dialog, defaultValues) {
    const fieldValues = {}
    for (var option in defaultValues) {
      fieldValues[option.replace('dialog_', '')] = defaultValues[option]
    }
    // Just for user reference for dialog heirarchy dialog => tabs => groups => fields => field
    dialog.dialog_tabs.forEach((tab, tab_index) => { // tabs
      tab.dialog_groups.forEach((group, group_index) => { // groups
        group.dialog_fields.forEach((field, field_index) => { // fields
          const fieldValue = (angular.isDefined(fieldValues[field.name]) ? fieldValues[field.name] : field.default_value)
          dialog.dialog_tabs[tab_index].dialog_groups[group_index].dialog_fields[field_index].default_value = fieldValue
        })
      })
    })

    return dialog
  }
}

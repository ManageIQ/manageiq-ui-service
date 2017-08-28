/* eslint camelcase: "off" */
/* eslint angular/angularelement: "off" */

/** @ngInject */
export function DialogFieldRefreshFactory (CollectionsApi) {
  var service = {
    refreshDialogField: refreshDialogField
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
}

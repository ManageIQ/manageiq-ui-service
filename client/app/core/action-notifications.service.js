/** @ngInject */
export function ActionNotificationsFactory(EventNotifications) {
  return {
    add: add,
  };

  function add(response, successMsg = "", failMsg = "") {
    response.results.forEach((response) => {
      response.success ? EventNotifications.success(successMsg + ' ' + response.message) : EventNotifications.error(failMsg + ' ' + response.message);
    });
  }
}

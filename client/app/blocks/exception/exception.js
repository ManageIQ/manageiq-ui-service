/** @ngInject */
export function exception(logger) {
  var service = {
    catcher: catcher,
  };

  return service;

  function catcher(message) {
    return function(error) {
      if (error.data && error.data.description) {
        message += '\n' + error.data.description;
        error.data.description = message;
      }
      logger.error(message, error);

      return Promise.reject(error);
    };
  }
}

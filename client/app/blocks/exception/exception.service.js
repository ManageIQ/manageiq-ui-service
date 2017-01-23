// The exception service is used to easily create appropriate callbacks to pass
// to `.catch` clauses of Promise chains.
//
// If you simply want to log the exception and reject so that another `.catch`
// can handle, use `exception.log` and pass a log message:
//
//   .catch(exception.log('Something went wrong'));
//
// If you are using `.catch` in a place where you wish to handle the exception
// and not reject use `exception.catch`:
//
//   .catch(exception.catch('Nothing to do here'));

/** @ngInject */
export function exception(logger) {
  var service = {
    catch: exceptionCatcher,
    log: exceptionLogger,
  };

  return service;

  function exceptionCatcher(message) {
    return function(error) {
      logErrorMessage(message, error);
    };
  }

  function exceptionLogger(message) {
    return function(error) {
      logErrorMessage(message, error);

      return Promise.reject(error);
    };
  }

  // Private
  function logErrorMessage(message, error) {
    if (error.data && error.data.description) {
      message += '\n' + error.data.description;
      error.data.description = message;
    }

    logger.error(message, error);
  }
}

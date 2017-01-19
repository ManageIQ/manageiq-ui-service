import exception from './exception.js';
import exceptionHandlerProvider from './exception-handler.provider.js';
import logger from '../logger/logger.module.js';

export default angular
  .module('blocks.exception', [
    logger,
  ])
  .factory('exception', exception)
  .provider('exceptionHandler', exceptionHandlerProvider)
  .config(config)
  .name;

/**
  * Configure by setting an optional string value for appErrorPrefix.
  * Accessible via config.appErrorPrefix (via config value).
  * @param  {[type]} $provide
  * @return {[type]}
  * @ngInject
  */
function config($provide) {
  $provide.decorator('$exceptionHandler', extendExceptionHandler);
}

/**
  * Extend the $exceptionHandler service to also display a toast.
  * @param  {Object} $delegate
  * @param  {Object} exceptionHandler
  * @param  {Object} logger
  * @return {Function} the decorated $exceptionHandler service
  * @ngInject
  */
function extendExceptionHandler($delegate, exceptionHandler, logger) {
  return function(exception, cause) {
    var appErrorPrefix = exceptionHandler.config.appErrorPrefix || '';
    var errorData = {exception: exception, cause: cause};
    exception.message = appErrorPrefix + exception.message;
    $delegate(exception, cause);
    /**
      * Could add the error to a service's collection,
      * add errors to $rootScope, log errors to remote web server,
      * or log locally. Or throw hard. It is entirely up to you.
      * throw exception;
      *
      * @example
      *     throw { message: 'error message we added' };
      */
    logger.error(exception.message, errorData);
  };
}

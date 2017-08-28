/**
  * Must configure the exception handling
  * @return {[type]}
  */
export function exceptionHandlerProvider () {
  this.config = {
    appErrorPrefix: undefined
  }

  this.configure = function (appErrorPrefix) {
    this.config.appErrorPrefix = appErrorPrefix
  }

  this.$get = function () {
    return {config: this.config}
  }
}

/**
  * Configure by setting an optional string value for appErrorPrefix.
  * Accessible via config.appErrorPrefix (via config value).
  * @param  {[type]} $provide
  * @return {[type]}
  * @ngInject
  */
export function config ($provide) {
  $provide.decorator('$exceptionHandler', extendExceptionHandler)
}

/**
  * Extend the $exceptionHandler service to also display a toast.
  * @param  {Object} $delegate
  * @param  {Object} exceptionHandler
  * @param  {Object} logger
  * @return {Function} the decorated $exceptionHandler service
  * @ngInject
  */
function extendExceptionHandler ($delegate, exceptionHandler, $log) {
  return function (exception, cause) {
    if (angular.isString(exception)) {
      exception = Error(exception)
    }

    var appErrorPrefix = exceptionHandler.config.appErrorPrefix || ''
    var errorData = {exception: exception, cause: cause}
    exception.message = appErrorPrefix + exception.message
    $delegate(exception, cause)
    /**
      * Could add the error to a service's collection,
      * add errors to $rootScope, log errors to remote web server,
      * or log locally. Or throw hard. It is entirely up to you.
      * throw exception;
      *
      * @example
      *     throw { message: 'error message we added' };
      */
    $log.error(exception.message, errorData)
  }
}

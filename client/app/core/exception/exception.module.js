import { config, exceptionHandlerProvider } from './exception-handler.provider.js'
import { exception } from './exception.service.js'

export const ExceptionModule = angular
  .module('app.core.exception', [])
  .factory('exception', exception)
  .provider('exceptionHandler', exceptionHandlerProvider)
  .config(config)
  .name

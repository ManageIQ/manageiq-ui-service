import { config, exceptionHandlerProvider } from './exception-handler.provider.js';
import { exception } from './exception.service.js';

export default angular
  .module('blocks.exception', [
  ])
  .factory('exception', exception)
  .provider('exceptionHandler', exceptionHandlerProvider)
  .config(config)
  .name;

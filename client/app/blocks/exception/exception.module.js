import { config, exceptionHandlerProvider } from './exception-handler.provider.js';
import { exception } from './exception.js';

export default angular
  .module('blocks.exception', [
    'blocks.logger',
  ])
  .factory('exception', exception)
  .provider('exceptionHandler', exceptionHandlerProvider)
  .config(config)
  .name;

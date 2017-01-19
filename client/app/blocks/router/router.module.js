import logger from '../logger/logger.module.js';
import routerHelperProvider from './router-helper.provider.js';
import uiRouter from 'angular-ui-router';

export default angular
  .module('blocks.router', [
    uiRouter,
    logger,
  ])
  .provider('routerHelper', routerHelperProvider)
  .name;

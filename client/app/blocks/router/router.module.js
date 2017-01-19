import { routerHelperProvider } from './router-helper.provider.js';

export default angular
  .module('blocks.router', [
    'ui.router',
    'blocks.logger',
  ])
  .provider('routerHelper', routerHelperProvider)
  .name;

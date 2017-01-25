import { routerHelperProvider } from './router-helper.provider.js';

export default angular
  .module('blocks.router', [
    'ui.router',
  ])
  .provider('routerHelper', routerHelperProvider)
  .name;

import { routerHelperProvider } from './router-helper.provider.js'

export const RouterModule = angular
  .module('app.core.router', [])
  .provider('routerHelper', routerHelperProvider)
  .name

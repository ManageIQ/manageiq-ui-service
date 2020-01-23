import { RootReducer } from '../reducers'
var DEVEL_DOMAINS = [
  'localhost',
  '127.0.0.1',
  '[::1]'
]

var isDevel = window._.includes(DEVEL_DOMAINS, window.location.hostname)
const hasDevTools = angular.isDefined(window.__REDUX_DEVTOOLS_EXTENSION__)
/** @ngInject */
export function configure ($logProvider, $compileProvider, $ngReduxProvider) {
  $logProvider.debugEnabled(isDevel)
  $compileProvider.debugInfoEnabled(isDevel)
  const storeEnhancers = []
  if (hasDevTools) {
    storeEnhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__())
  }
  $ngReduxProvider.createStoreWith(RootReducer, [], storeEnhancers)
}

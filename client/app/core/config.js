/* eslint angular/window-service: "off" */
import { RootReducer } from '../reducers'
import { autoRehydrate } from 'redux-persist'

var DEVEL_DOMAINS = [
  'localhost',
  '127.0.0.1',
  '[::1]'
]

var isDevel = window._.includes(DEVEL_DOMAINS, window.location.hostname)
const hasDevTools = angular.isDefined(window.__REDUX_DEVTOOLS_EXTENSION__)

/** @ngInject */
export function configure ($logProvider, $compileProvider, $qProvider, $ngReduxProvider) {
  $logProvider.debugEnabled(isDevel)
  $compileProvider.debugInfoEnabled(isDevel)

  // TODO: Remove following line as per: https://docs.angularjs.org/guide/migration#migrate1.5to1.6-ng-services-$compile
  $compileProvider.preAssignBindingsEnabled(true)

  $qProvider.errorOnUnhandledRejections(false)

  const storeEnhancers = [
    autoRehydrate()
  ]
  if (hasDevTools) {
    storeEnhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__())
  }
  $ngReduxProvider.createStoreWith(RootReducer, [], storeEnhancers)
}

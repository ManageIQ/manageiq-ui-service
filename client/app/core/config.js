/* eslint angular/window-service: "off" */

var DEVEL_DOMAINS = [
  'localhost',
  '127.0.0.1',
  '[::1]'
]

var isDevel = window._.includes(DEVEL_DOMAINS, window.location.hostname)

/** @ngInject */
export function configure ($logProvider, $compileProvider, $qProvider) {
  $logProvider.debugEnabled(isDevel)
  $compileProvider.debugInfoEnabled(isDevel)

  // TODO: Remove following line as per: https://docs.angularjs.org/guide/migration#migrate1.5to1.6-ng-services-$compile
  $compileProvider.preAssignBindingsEnabled(true)

  $qProvider.errorOnUnhandledRejections(false)
}

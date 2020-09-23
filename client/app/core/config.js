const DEVEL_DOMAINS = [
  'localhost',
  '127.0.0.1',
  '[::1]'
];
const isDevel = DEVEL_DOMAINS.includes(window.location.hostname);

/** @ngInject */
export function configure($logProvider, $compileProvider) {
  $logProvider.debugEnabled(isDevel);
  $compileProvider.debugInfoEnabled(isDevel);
}

/* eslint angular/window-service: "off" */
(function() {
  'use strict';

  angular.module('app.core')
    .config(configure)
    .run(init);

  var DEVEL_DOMAINS = [
    'localhost',
    '127.0.0.1',
    '[::1]',
  ];

  var isDevel = window._.includes(DEVEL_DOMAINS, window.location.hostname);

  /** @ngInject */
  function configure($logProvider, $compileProvider) {
    $logProvider.debugEnabled(isDevel);
    $compileProvider.debugInfoEnabled(isDevel);

    // TODO: Remove following line as per: https://docs.angularjs.org/guide/migration#migrate1.5to1.6-ng-services-$compile
    $compileProvider.preAssignBindingsEnabled(true);
  }

  /** @ngInject */
  function init(logger) {
    logger.showToasts = isDevel;
  }
})();

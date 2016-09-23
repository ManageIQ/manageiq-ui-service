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
  }

  /** @ngInject */
  function init(logger) {
    logger.showToasts = isDevel;
  }
})();

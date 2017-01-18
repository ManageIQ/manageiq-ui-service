(function() {
  'use strict';

  angular.module('app.core', [
    // Angular modules
    'ngAnimate',
    'ngSanitize',
    'ngMessages',

    // Blocks modules
    'blocks.exception',
    'blocks.logger',
    'blocks.router',

    'app.skin',
    'app.resources',
    'app.services',

    // Third party modules
    'ui.router',
    'base64',
  ]);
})();

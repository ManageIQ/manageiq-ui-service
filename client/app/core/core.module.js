import 'angular-animate';
import 'angular-messages';
import 'angular-sanitize';
import 'angular-base64';
import 'angular-ui-router';

angular.module('app.core', [
  // Angular modules
  'ngAnimate',
  'ngMessages',
  'ngSanitize',

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

/* global _:false, ActionCable:false, $:false, sprintf: false, moment: false */

import { authConfig, authInit } from './authorization.config.js';
import { configure, init } from './config.js';
import { formatBytes, megaBytes } from '../filters/format-bytes.filter.js';
import { navConfig, navInit } from './navigation.config.js';

import { AuthenticationApiFactory } from './authentication-api.factory.js';
import { CollectionsApiFactory } from './collections-api.factory.js';
import { ExceptionModule } from './exception/exception.module.js';
import { LoggerService } from './logger.service.js';
import { RouterModule } from './router/router.module.js';
import { gettextInit } from './gettext.config.js';
import { layoutInit } from  './layouts.config.js';
import { substitute } from '../filters/substitute.js';

export const CoreModule = angular
  .module('app.core', [
    'gettext',
    'ngAnimate',
    'ngSanitize',
    'ngMessages',
    'ui.router',
    'base64',

    ExceptionModule,
    RouterModule,

    'app.skin',
    'app.services',
  ])
  .constant('lodash', _)
  .constant('ActionCable', ActionCable)
  .constant('sprintf', sprintf)
  .constant('moment', moment)
  .constant('API_BASE', location.protocol + '//' + location.host)
  .constant('API_LOGIN', '')
  .constant('API_PASSWORD', '')
  .filter('formatBytes', formatBytes)
  .filter('megaBytes', megaBytes)
  .filter('substitute', substitute)
  .factory('logger', LoggerService)
  .factory('AuthenticationApi', AuthenticationApiFactory)
  .factory('CollectionsApi', CollectionsApiFactory)
  .config(configure)
  .config(authConfig)
  .config(navConfig)
  .run(authInit)
  .run(gettextInit)
  .run(layoutInit)
  .run(navInit)
  .run(init)
  .name;

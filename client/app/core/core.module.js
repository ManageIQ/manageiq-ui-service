/* global _:false, ActionCable:false, $:false, sprintf: false, moment: false */

import { configure, init } from './config.js';
import { formatBytes, megaBytes } from '../filters/format-bytes.filter.js';

import { ExceptionModule } from './exception/exception.module.js';
import { LoggerService } from './logger.service.js';
import { RouterModule } from './router/router.module.js';
import { substitute } from '../filters/substitute.js';

export const CoreModule = angular
  .module('app.core', [
    'ngAnimate',
    'ngSanitize',
    'ngMessages',
    'ui.router',
    'base64',

    ExceptionModule,
    RouterModule,

    'app.skin',
    'app.resources',
    'app.services',
  ])
  .constant('lodash', _)
  .constant('ActionCable', ActionCable)
  .constant('sprintf', sprintf)
  .constant('moment', moment)
  .filter('formatBytes', formatBytes)
  .filter('megaBytes', megaBytes)
  .filter('substitute', substitute)
  .factory('logger', LoggerService)
  .config(configure)
  .run(init)
  .name;

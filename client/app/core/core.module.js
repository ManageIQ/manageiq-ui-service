/* global _:false, ActionCable:false, $:false, sprintf: false, moment: false */

import { configure, init } from './config.js';
import { formatBytes, megaBytes } from '../filters/format-bytes.filter.js';

import { substitute } from '../filters/substitute.js';
import { LoggerService } from './logger.service.js';

export const CoreModule = angular
  .module('app.core', [
    // Angular modules
    'ngAnimate',
    'ngSanitize',
    'ngMessages',

    // Blocks modules
    'blocks.exception',
    'blocks.router',

    'app.skin',
    'app.resources',
    'app.services',

    // Third party modules
    'ui.router',
    'base64',
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

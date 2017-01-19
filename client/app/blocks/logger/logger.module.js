import { logger } from './logger.js';

export default angular
  .module('blocks.logger', [])
  .factory('logger', logger)
  .name;

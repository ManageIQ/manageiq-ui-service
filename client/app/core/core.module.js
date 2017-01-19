import 'angular-animate';
import 'angular-messages';
import 'angular-sanitize';

import exception from '../blocks/exception/exception.module.js';
import logger from '../blocks/logger/logger.module.js';
import resources from '../resources/resources.module.js';
import router from '../blocks/router/router.module.js';
import services from '../services/services.module.js';
import skin from '../skin/skin.module.js';

export default angular
  .module('app.core', [
    // Angular modules
    'ngAnimate',
    'ngMessages',
    'ngSanitize',

    // Blocks modules
    exception,
    logger,
    router,

    skin,
    resources,
    services,
  ]);

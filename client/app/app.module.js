import './globals.js';
import './blocks/exception/exception.module.js';
import './blocks/logger/logger.module.js';
import './blocks/router/router.module.js';
import './components/components.module.js';
import './config/config.module.js';
import './core/core.module.js';
import './resources/resources.module.js';
import './services/services.module.js';
import './skin/skin.module.js';
import './states/states.module.js';

import { AppController } from './app.controller.js';

export default angular
  .module('app', [
    'gettext',
    'app.core',
    'app.config',
    'app.states',
    'ngProgress',
    'miqStaticAssets',
  ])
  .controller('AppController', AppController)
  .name;

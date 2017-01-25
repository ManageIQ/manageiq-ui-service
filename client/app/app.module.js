import './globals.js';
import './components/components.module.js';
import './config/config.module.js';
import './resources/resources.module.js';
import './services/services.module.js';
import './skin/skin.module.js';
import './states/states.module.js';

import { AppController } from './app.controller.js';
import { CoreModule } from './core/core.module.js';

export default angular
  .module('app', [
    'gettext',
    CoreModule,
    'app.config',
    'app.states',
    'ngProgress',
    'miqStaticAssets',
  ])
  .controller('AppController', AppController)
  .name;

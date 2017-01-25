import './globals.js';
import './components/components.module.js';
import './skin/skin.module.js';
import './states/states.module.js';

import { AppController } from './app.controller.js';
import { CoreModule } from './core/core.module.js';

export default angular
  .module('app', [
    CoreModule,
    'app.states',
    'ngProgress',
    'miqStaticAssets',
  ])
  .controller('AppController', AppController)
  .name;

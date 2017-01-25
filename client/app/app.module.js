import './globals.js';
import './components/components.module.js';

import { AppController } from './app.controller.js';
import { AppRoutingModule } from './states/states.module.js';
import { CoreModule } from './core/core.module.js';

export default angular
  .module('app', [
    'ngProgress',

    AppRoutingModule,
    CoreModule,
  ])
  .controller('AppController', AppController)
  .name;

import './globals.js';
import './components/components.module.js';

import { AdminModule } from './admin/admin.module.js';
import { AppController } from './app.controller.js';
import { AppRoutingModule } from './states/states.module.js';
import { CatalogsModule } from './catalogs/catalogs.module.js';
import { CoreModule } from './core/core.module.js';
import { DialogsModule } from './dialogs/dialogs.module.js';
import { RequestsModule } from './requests/requests.module.js';

export default angular
  .module('app', [
    'ngProgress',

    AppRoutingModule,
    CoreModule,

    // Feature Modules
    AdminModule,
    CatalogsModule,
    DialogsModule,
    RequestsModule,
  ])
  .controller('AppController', AppController)
  .name;

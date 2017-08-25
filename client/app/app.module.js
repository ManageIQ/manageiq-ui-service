import './globals.js'
import './components/components.module.js'

import { AppController } from './app.controller.js'
import { AppRoutingModule } from './states/states.module.js'
import { CatalogsModule } from './catalogs/catalogs.module.js'
import { CoreModule } from './core/core.module.js'
import { RequestsModule } from './requests/requests.module.js'
import { ServicesModule } from './services/services.module.js'

export default angular
  .module('app', [
    'ngProgress',

    AppRoutingModule,
    CoreModule,

    // Feature Modules
    CatalogsModule,
    RequestsModule,
    ServicesModule
  ])
  .controller('AppController', AppController)
  .name

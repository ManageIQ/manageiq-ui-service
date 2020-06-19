import {AboutMeState} from './about-me/about-me.state.js'
import {CatalogsDetailsState} from './catalogs/details/details.state.js'
import {CatalogsExplorerState} from './catalogs/explorer/explorer.state.js'
import {CatalogsState} from './catalogs/catalogs.state.js'
import {CustomButtonDetailsState} from './services/custom_button_details/custom_button_details.state.js'
import {DashboardState} from './dashboard/dashboard.state.js'
import {ErrorState} from './error/error.state.js'
import {HelpState} from './help/help.state.js'
import {LoginState} from './login/login.state.js'
import {OidcLoginState} from './oidc/oidc-login.state.js'
import {LogoutState} from './logout/logout.state.js'
import {NotFoundState} from './404/404.state.js'
import {OrdersDetailsState} from './orders/details/details.state.js'
import {OrdersExplorerState} from './orders/explorer/explorer.state.js'
import {OrdersState} from './orders/orders.state.js'
import {ServicesDetailsState} from './services/details/details.state.js'
import {ServicesExplorerState} from './services/explorer/explorer.state.js'
import {ServicesReconfigureState} from './services/reconfigure/reconfigure.state.js'
import {ServicesState} from './services/services.state.js'
import {VmsDetailsState} from './services/resource-details/details.state.js'
import {VmsSnapshotsState} from './vms/snapshots/snapshots.state.js'
import {VmsState} from './vms/vms.state.js'

export const AppRoutingModule = angular
  .module('app.states', [
    'app.core',
    'app.components'
  ])
  .run(NotFoundState)
  .run(AboutMeState)
  .run(DashboardState)
  .run(CatalogsState)
  .run(CatalogsExplorerState)
  .run(CatalogsDetailsState)
  .run(ErrorState)
  .run(HelpState)
  .run(LoginState)
  .run(OidcLoginState)
  .run(LogoutState)
  .run(OrdersDetailsState)
  .run(OrdersExplorerState)
  .run(OrdersState)
  .run(CustomButtonDetailsState)
  .run(ServicesDetailsState)
  .run(ServicesExplorerState)
  .run(ServicesReconfigureState)
  .run(ServicesState)
  .run(VmsDetailsState)
  .run(VmsSnapshotsState)
  .run(VmsState)
  .name

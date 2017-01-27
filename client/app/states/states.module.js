import { AboutMeState } from './about-me/about-me.state.js';
import { AdminState } from './administration/admin.state.js';
import { CatalogsEditorState } from './designer/catalogs/editor/editor.state.js';
import { CatalogsState } from './designer/catalogs/catalogs.state.js';
import { CustomButtonDetailsState } from './services/custom_button_details/custom_button_details.state.js';
import { DashboardState } from './dashboard/dashboard.state.js';
import { DesignerState } from './designer/designer.state.js';
import { DialogsDetailState } from './designer/dialogs/details/details.state.js';
import { DialogsEditState } from './designer/dialogs/edit/edit.state.js';
import { DialogsListState } from './designer/dialogs/list/list.state.js';
import { DialogsState } from './designer/dialogs/dialogs.state.js';
import { ErrorState } from './error/error.state.js';
import { HelpState } from './help/help.state.js';
import { LoginState } from './login/login.state.js';
import { LogoutState } from './logout/logout.state.js';
import { MarketplaceDetailsState } from './marketplace/details/details.state.js';
import { MarketplaceListState } from './marketplace/list/list.state.js';
import { MarketplaceState } from './marketplace/marketplace.state.js';
import { NotFoundState } from './404/404.state.js';
import { OrdersDetailsState } from './orders/details/details.state.js';
import { OrdersExplorerState } from './orders/explorer/explorer.state.js';
import { OrdersState } from './orders/orders.state.js';
import { ProductsDetailsState } from './products/details/details.state.js';
import { ProductsState } from './products/products.state.js';
import { RequestsDetailsState } from './requests/details/details.state.js';
import { RequestsExplorerState } from './requests/explorer/explorer.state.js';
import { RequestsState } from './requests/requests.state.js';
import { RulesState } from './administration/rules/rules.state.js';
import { ServicesDetailsState } from './services/details/details.state.js';
import { ServicesExplorerState } from './services/explorer/explorer.state.js';
import { ServicesReconfigureState } from './services/reconfigure/reconfigure.state.js';
import { ServicesState } from './services/services.state.js';
import { VmsDetailsState } from './vms/details/details.state.js';
import { VmsState } from './vms/vms.state.js';

export const AppRoutingModule = angular
  .module('app.states', [
    'app.core',
    'app.components',
  ])
  .run(NotFoundState)
  .run(AboutMeState)
  .run(AdminState)
  .run(RulesState)
  .run(DashboardState)
  .run(CatalogsState)
  .run(CatalogsEditorState)
  .run(DesignerState)
  .run(DialogsState)
  .run(DialogsDetailState)
  .run(DialogsEditState)
  .run(DialogsListState)
  .run(ErrorState)
  .run(HelpState)
  .run(LoginState)
  .run(LogoutState)
  .run(MarketplaceDetailsState)
  .run(MarketplaceListState)
  .run(MarketplaceState)
  .run(OrdersDetailsState)
  .run(OrdersExplorerState)
  .run(OrdersState)
  .run(ProductsDetailsState)
  .run(ProductsState)
  .run(RequestsDetailsState)
  .run(RequestsExplorerState)
  .run(RequestsState)
  .run(CustomButtonDetailsState)
  .run(ServicesDetailsState)
  .run(ServicesExplorerState)
  .run(ServicesReconfigureState)
  .run(ServicesState)
  .run(VmsDetailsState)
  .run(VmsState)
  .name;

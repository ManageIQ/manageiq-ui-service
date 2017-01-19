import { BlueprintsStateFactory } from './blueprints-state.service.js';
import { CatalogsStateFactory } from './catalogs-state.service.js';
import { ChargebackFactory } from './chargeback.service.js';
import { ConsolesFactory } from './consoles.service.js';
import { DesignerStateFactory } from './designer-state.service.js';
import { DialogFieldRefreshFactory } from './dialog-field-refresh.service.js';
import { DialogStateFactory } from './dialogs-state.service.js';
import { EventNotificationsFactory } from './event-notifications.service.js';
import { LanguageFactory } from './language.service.js';
import { ListConfigurationFactory } from './list-configuration.service.js';
import { ListViewFactory } from './list-view.service.js';
import { MarketplaceStateFactory } from './marketplace-state.service.js';
import { MessagesFactory } from './messages.service.js';
import { NavCountsFactory } from './navcounts.service.js';
import { NavigationProvider } from './navigation.provider.js';
import { OrdersStateFactory } from './orders-state.service.js';
import { PollingFactory } from './polling.service.js';
import { PowerOperationsFactory } from './poweroperations.service.js';
import { ProductInfo } from './product-info.service.js';
import { ProfilesStateFactory } from './profiles-state.service.js';
import { RBACFactory } from './rbac.service.js';
import { RequestsStateFactory } from './requests-state.service.js';
import { RulesStateFactory } from './rules-state.service.js';
import { ServerInfo } from './server-info.service.js';
import { ServicesStateFactory } from './services-state.service.js';
import { SessionFactory } from './session.service.js';
import { ShoppingCartFactory } from './shopping-cart.service.js';
import { taggingService } from './tagging.service.js';

export default angular
  .module('app.services', [
    'ngStorage',
    'ngCookies',
  ])
  .factory('BlueprintsState', BlueprintsStateFactory)
  .factory('CatalogsState', CatalogsStateFactory)
  .factory('Chargeback', ChargebackFactory)
  .factory('Consoles', ConsolesFactory)
  .factory('DesignerState', DesignerStateFactory)
  .factory('DialogFieldRefresh', DialogFieldRefreshFactory)
  .factory('DialogsState', DialogStateFactory)
  .factory('EventNotifications', EventNotificationsFactory)
  .factory('Language', LanguageFactory)
  .factory('ListConfiguration', ListConfigurationFactory)
  .factory('ListView', ListViewFactory)
  .factory('MarketplaceState', MarketplaceStateFactory)
  .factory('Messages', MessagesFactory)
  .factory('NavCounts', NavCountsFactory)
  .provider('Navigation', NavigationProvider)
  .factory('OrdersState', OrdersStateFactory)
  .factory('Polling', PollingFactory)
  .factory('PowerOperations', PowerOperationsFactory)
  .factory('ProductInfo', ProductInfo)
  .factory('ProfilesState', ProfilesStateFactory)
  .factory('RBAC', RBACFactory)
  .factory('RequestsState', RequestsStateFactory)
  .factory('RulesState', RulesStateFactory)
  .factory('ServerInfo', ServerInfo)
  .factory('ServicesState', ServicesStateFactory)
  .factory('Session', SessionFactory)
  .factory('ShoppingCart', ShoppingCartFactory)
  .factory('taggingService', taggingService)
  .name;

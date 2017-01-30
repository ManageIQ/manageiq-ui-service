/* global _:false, ActionCable:false, $:false, sprintf: false, moment: false */

import { authConfig, authInit } from './authorization.config.js';
import { configure, init } from './config.js';
import { formatBytes, megaBytes } from '../filters/format-bytes.filter.js';
import { navConfig, navInit } from './navigation.config.js';
import { AuthenticationApiFactory } from './authentication-api.factory.js';
import { CatalogsStateFactory } from './catalogs-state.service.js';
import { ChargebackFactory } from './chargeback.service.js';
import { CollectionsApiFactory } from './collections-api.factory.js';
import { ConsolesFactory } from './consoles.service.js';
import { DesignerStateFactory } from './designer-state.service.js';
import { DialogFieldRefreshFactory } from './dialog-field-refresh.service.js';
import { DialogStateFactory } from './dialogs-state.service.js';
import { EventNotificationsFactory } from './event-notifications.service.js';
import { ExceptionModule } from './exception/exception.module.js';
import { LanguageFactory } from './language.service.js';
import { ListConfigurationFactory } from './list-configuration.service.js';
import { ListViewFactory } from './list-view.service.js';
import { LoggerService } from './logger.service.js';
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
import { RouterModule } from './router/router.module.js';
import { RulesStateFactory } from './rules-state.service.js';
import { ServerInfo } from './server-info.service.js';
import { ServicesStateFactory } from './services-state.service.js';
import { SessionFactory } from './session.service.js';
import { ShoppingCartFactory } from './shopping-cart.service.js';
import { SkinModule } from '../skin/skin.module.js';
import { gettextInit } from './gettext.config.js';
import { layoutInit } from  './layouts.config.js';
import { substitute } from '../filters/substitute.js';
import { taggingService } from './tagging.service.js';

export const CoreModule = angular
  .module('app.core', [
    'base64',
    'gettext',
    'miqStaticAssets',
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngSanitize',
    'ngStorage',
    'ui.router',

    ExceptionModule,
    RouterModule,
    SkinModule,
  ])
  .constant('lodash', _)
  .constant('ActionCable', ActionCable)
  .constant('sprintf', sprintf)
  .constant('moment', moment)
  .constant('API_BASE', location.protocol + '//' + location.host)
  .constant('API_LOGIN', '')
  .constant('API_PASSWORD', '')
  .filter('formatBytes', formatBytes)
  .filter('megaBytes', megaBytes)
  .filter('substitute', substitute)
  .factory('AuthenticationApi', AuthenticationApiFactory)
  .factory('CatalogsState', CatalogsStateFactory)
  .factory('Chargeback', ChargebackFactory)
  .factory('CollectionsApi', CollectionsApiFactory)
  .factory('Consoles', ConsolesFactory)
  .factory('DesignerState', DesignerStateFactory)
  .factory('DialogFieldRefresh', DialogFieldRefreshFactory)
  .factory('DialogsState', DialogStateFactory)
  .factory('EventNotifications', EventNotificationsFactory)
  .factory('Language', LanguageFactory)
  .factory('ListConfiguration', ListConfigurationFactory)
  .factory('ListView', ListViewFactory)
  .factory('Messages', MessagesFactory)
  .factory('NavCounts', NavCountsFactory)
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
  .factory('logger', LoggerService)
  .factory('taggingService', taggingService)
  .provider('Navigation', NavigationProvider)
  .config(configure)
  .config(authConfig)
  .config(navConfig)
  .run(authInit)
  .run(gettextInit)
  .run(layoutInit)
  .run(navInit)
  .run(init)
  .name;

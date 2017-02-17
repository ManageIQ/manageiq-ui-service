/* global _:false, ActionCable:false, $:false, sprintf: false, moment: false */
/* eslint-disable sort-imports */

import {
  authConfig,
  authInit,
} from './authorization.config.js';

import {
  configure,
  init,
} from './config.js';

import {
  navConfig,
  navInit,
} from './navigation.config.js';

// Core
import { AuthenticationApiFactory } from './authentication-api.factory.js';
import { BaseModalController } from './modal/base-modal-controller.js';
import { BaseModalFactory } from './modal/base-modal.factory.js';
import { ChargebackFactory } from './chargeback.service.js';
import { CollectionsApiFactory } from './collections-api.factory.js';
import { DialogFieldRefreshFactory } from './dialog-field-refresh.service.js';
import { EventNotificationsFactory } from './event-notifications.service.js';
import { ExceptionModule } from './exception/exception.module.js';
import { LanguageFactory } from './language.service.js';
import { LanguageSwitcherDirective } from './language-switcher/language-switcher.directive.js';
import { ListConfigurationFactory } from './list-configuration.service.js';
import { ListViewFactory } from './list-view.service.js';
import { LoggerService } from './logger.service.js';
import { MessagesFactory } from './messages.service.js';
import { NavCountsFactory } from './navcounts.service.js';
import { NavigationController } from './navigation/navigation-controller.js';
import { NavigationProvider } from './navigation.provider.js';
import { PollingFactory } from './polling.service.js';
import { ProductInfo } from './product-info.service.js';
import { RBACFactory } from './rbac.service.js';
import { RouterModule } from './router/router.module.js';
import { SaveModalDialogFactory } from './save-modal-dialog/save-modal-dialog.factory.js';
import { ServerInfo } from './server-info.service.js';
import { SessionFactory } from './session.service.js';
import { SharedModule } from '../shared/shared.module.js';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component.js';
import { ShoppingCartFactory } from './shopping-cart.service.js';
import { SkinModule } from '../skin/skin.module.js';
import { TemplatesServiceFactory } from './templates.service.js';
import { TagEditorFactory } from './tag-editor-modal/tag-editor-modal.service.js';
import { gettextInit } from './gettext.config.js';
import { layoutInit } from  './layouts.config.js';
import { taggingService } from './tagging.service.js';

// Services
import { ConsolesFactory } from './consoles.service.js';
import { PowerOperationsFactory } from './poweroperations.service.js';
import { ServicesStateFactory } from './services-state.service.js';
import { VmsService } from './vms.service.js';

// Orders/Requests
import { OrdersStateFactory } from './orders-state.service.js';
import { RequestsStateFactory } from './requests-state.service.js';

// Admin
import { ProfilesStateFactory } from './profiles-state.service.js';
import { RulesStateFactory } from './rules-state.service.js';

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
    SharedModule,
    SkinModule,
  ])
  .constant('lodash', _)
  .constant('ActionCable', ActionCable)
  .constant('sprintf', sprintf)
  .constant('moment', moment)
  .constant('API_BASE', location.protocol + '//' + location.host)
  .constant('API_LOGIN', '')
  .constant('API_PASSWORD', '')
  .controller('BaseModalController', BaseModalController)
  .controller('NavigationController', NavigationController)
  .component('shoppingCart', ShoppingCartComponent)
  .directive('languageSwitcher', LanguageSwitcherDirective)
  .factory('AuthenticationApi', AuthenticationApiFactory)
  .factory('Chargeback', ChargebackFactory)
  .factory('CollectionsApi', CollectionsApiFactory)
  .factory('Consoles', ConsolesFactory)
  .factory('DialogFieldRefresh', DialogFieldRefreshFactory)
  .factory('EventNotifications', EventNotificationsFactory)
  .factory('Language', LanguageFactory)
  .factory('ListConfiguration', ListConfigurationFactory)
  .factory('ListView', ListViewFactory)
  .factory('Messages', MessagesFactory)
  .factory('ModalService', BaseModalFactory)
  .factory('NavCounts', NavCountsFactory)
  .factory('OrdersState', OrdersStateFactory)
  .factory('Polling', PollingFactory)
  .factory('PowerOperations', PowerOperationsFactory)
  .factory('ProductInfo', ProductInfo)
  .factory('ProfilesState', ProfilesStateFactory)
  .factory('RBAC', RBACFactory)
  .factory('RequestsState', RequestsStateFactory)
  .factory('RulesState', RulesStateFactory)
  .factory('SaveModalDialog', SaveModalDialogFactory)
  .factory('ServerInfo', ServerInfo)
  .factory('ServicesState', ServicesStateFactory)
  .factory('Session', SessionFactory)
  .factory('ShoppingCart', ShoppingCartFactory)
  .factory('TemplatesService', TemplatesServiceFactory)
  .factory('VmsService', VmsService)
  .factory('TagEditorModal', TagEditorFactory)
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

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
import { ApplianceInfo } from './appliance-info.service.js';
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
import { NavCountsFactory } from './navcounts.service.js';
import { NavigationController } from './navigation/navigation-controller.js';
import { NavigationProvider } from './navigation.provider.js';
import { PollingFactory } from './polling.service.js';
import { RBACFactory } from './rbac.service.js';
import { RouterModule } from './router/router.module.js';
import { SaveModalDialogFactory } from './save-modal-dialog/save-modal-dialog.factory.js';
import { SessionFactory } from './session.service.js';
import { SharedModule } from '../shared/shared.module.js';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component.js';
import { ShoppingCartFactory } from './shopping-cart.service.js';
import { SkinModule } from '../skin/skin.module.js';
import { TagEditorFactory } from './tag-editor-modal/tag-editor-modal.service.js';
import { gettextInit } from './gettext.config.js';
import { layoutInit } from  './layouts.config.js';
import { TaggingService } from './tagging.service.js';

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
    'ui.router.state.events',

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
  .constant('POLLING_INTERVAL', 10000)
  .constant('LONG_POLLING_INTERVAL', 30000)
  .controller('BaseModalController', BaseModalController)
  .controller('NavigationController', NavigationController)
  .component('shoppingCart', ShoppingCartComponent)
  .directive('languageSwitcher', LanguageSwitcherDirective)
  .factory('ApplianceInfo', ApplianceInfo)
  .factory('AuthenticationApi', AuthenticationApiFactory)
  .factory('Chargeback', ChargebackFactory)
  .factory('CollectionsApi', CollectionsApiFactory)
  .factory('DialogFieldRefresh', DialogFieldRefreshFactory)
  .factory('EventNotifications', EventNotificationsFactory)
  .factory('Language', LanguageFactory)
  .factory('ListConfiguration', ListConfigurationFactory)
  .factory('ListView', ListViewFactory)
  .factory('ModalService', BaseModalFactory)
  .factory('NavCounts', NavCountsFactory)
  .factory('Polling', PollingFactory)
  .factory('RBAC', RBACFactory)
  .factory('SaveModalDialog', SaveModalDialogFactory)
  .factory('Session', SessionFactory)
  .factory('ShoppingCart', ShoppingCartFactory)
  .factory('TagEditorModal', TagEditorFactory)
  .factory('TaggingService', TaggingService)
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

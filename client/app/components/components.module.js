/* eslint-disable sort-imports */

import { AutofocusDirective } from './autofocus/autofocus.directive.js';
import { CatalogEditorComponent } from './catalogs/catalog-editor.component.js';
import { CatalogsListComponent } from './catalogs/catalog-explorer.component';
import { ConfirmationDirective } from './confirmation/confirmation.directive.js';
import { CustomButtonDirective } from './custom-button/custom-button.directive.js';
import { CustomDropdownComponent } from './custom-dropdown/custom-dropdown.directive.js';
import { DetailRevealComponent } from './detail-reveal/detail-reveal.component.js';
import { DialogContentComponent } from './dialog-content/dialog-content.component.js';
import { DialogsListComponent } from './dialogs/dialogs-list.component.js';
import { DualPaneSelectorComponent } from './dual-pane-selector/dual-pane-selector.component.js';
import { EditServiceModalComponent } from './edit-service-modal/edit-service-modal.component.js';
import { FooterContentDirective } from './footer/footer-content.directive.js';
import { IconListComponent } from './icon-list/icon-list.component.js';
import { LanguageSwitcherDirective } from './language-switcher/language-switcher.directive.js';
import { LoadingComponent } from './loading/loading.component.js';
import { ModalActionsComponent } from './modal-actions/modal-actions.component.js';
import { BaseModalController } from './modal/base-modal-controller.js';
import { BaseModalFactory } from './modal/base-modal.factory.js';
import { NavigationController } from './navigation/navigation-contoller.js';
import { OrderExplorerComponent } from './order-explorer/order-explorer.component.js';
import { OwnershipServiceModalComponent } from './ownership-service-modal/ownership-service-modal.component.js';
import { PaginationComponent } from './pagination/pagination.component.js';
import { PowerStateComponent } from './power-state/power-state.component.js';
import { ProcessRequestsModalComponent } from './process-requests-modal/process-requests-modal.component.js';
import { ProcessOrderModalComponent } from './process-order-modal/process-order-modal.component.js';
import { ProfileDetailsComponent } from './profiles/profile-details.component.js';
import { ProfileEditorComponent } from './profiles/profile-editor.component.js';
import { ProfilesListComponent } from './profiles/profiles-list.component.js';
import { RequestExplorerComponent } from './request-explorer/request-explorer.component.js';
import { RequestListComponent } from './request-list/request-list.component.js';
import { RetireRemoveServiceModalComponent } from './retire-remove-service-modal/retire-remove-service-modal.component.js';
import { RetireServiceModalComponent } from './retire-service-modal/retire-service-modal-service.factory.js';
import { RulesListComponent } from './rules/rules-list.component.js';
import { SaveModalDialogFactory } from './save-modal-dialog/save-modal-dialog.factory.js';
import { ServiceExplorerComponent } from './services/service-explorer/service-explorer.component.js';
import { ServiceDetailsComponent } from './services/service-details/service-details.component';
import { ServiceDetailsAnsibleComponent } from './services/service-details/service-details-ansible.component';
import { ServiceDetailsAnsibleModalComponent } from './services/service-details/service-details-ansible-modal.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component.js';
import { SSCardComponent } from './ss-card/ss-card.component.js';
import { TagEditorFactory } from './tag-editor-modal/tag-editor-modal-service.factory.js';
import { TaggingComponent } from './tagging/tagging.component.js';
import { TemplateExplorerComponent } from './template-explorer/template-explorer.component.js';
import { VmSnapshotsComponent } from './vms/snapshots.component';

export default angular
  .module('app.components', [
    'app.core',
    'ui.bootstrap',
    'patternfly',
    'svgBaseFix',
    'miqStaticAssets',
  ])
  .directive('autofocus', AutofocusDirective)
  .component('catalogEditor', CatalogEditorComponent)
  .component('catalogExplorer', CatalogsListComponent)
  .directive('confirmation', ConfirmationDirective)
  .directive('customButton', CustomButtonDirective)
  .component('customDropdown', CustomDropdownComponent)
  .component('detailReveal', DetailRevealComponent)
  .component('dialogContent', DialogContentComponent)
  .component('dialogsList', DialogsListComponent)
  .component('dualPaneSelector', DualPaneSelectorComponent)
  .component('editServiceModal', EditServiceModalComponent)
  .directive('footerContent', FooterContentDirective)
  .component('iconList', IconListComponent)
  .directive('languageSwitcher', LanguageSwitcherDirective)
  .component('loading', LoadingComponent)
  .component('modalActions', ModalActionsComponent)
  .controller('BaseModalController', BaseModalController)
  .factory('ModalService', BaseModalFactory)
  .controller('NavigationController', NavigationController)
  .component('ownershipServiceModal', OwnershipServiceModalComponent)
  .component('orderExplorer', OrderExplorerComponent)
  .component('explorerPagination', PaginationComponent)
  .component('powerState', PowerStateComponent)
  .component('processRequestsModal', ProcessRequestsModalComponent)
  .component('processOrderModal', ProcessOrderModalComponent)
  .component('profileDetails', ProfileDetailsComponent)
  .component('profileEditor', ProfileEditorComponent)
  .component('profilesList', ProfilesListComponent)
  .component('requestExplorer', RequestExplorerComponent)
  .component('requestList', RequestListComponent)
  .component('retireRemoveServiceModal', RetireRemoveServiceModalComponent)
  .component('retireServiceModal', RetireServiceModalComponent)
  .component('rulesList', RulesListComponent)
  .factory('SaveModalDialog', SaveModalDialogFactory)
  .component('serviceExplorer', ServiceExplorerComponent)
  .component('serviceDetails', ServiceDetailsComponent)
  .component('serviceDetailsAnsible', ServiceDetailsAnsibleComponent)
  .component('serviceDetailsAnsibleModal', ServiceDetailsAnsibleModalComponent)
  .component('shoppingCart', ShoppingCartComponent)
  .component('ssCard', SSCardComponent)
  .factory('TagEditorModal', TagEditorFactory)
  .component('taggingWidget', TaggingComponent)
<<<<<<< HEAD
  .component('vmSnapshots', VmSnapshotsComponent)
=======
  .component('templateExplorer', TemplateExplorerComponent)
>>>>>>> dd7cce6... Created Orchestration template component
  .name;

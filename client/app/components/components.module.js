/* eslint-disable sort-imports */

import { AutofocusDirective } from './autofocus/autofocus.directive.js';
import { BlueprintCanvasDirective } from './blueprints/blueprint-canvas/blueprint-canvas.directive.js';
import { BlueprintDeleteFactory } from './blueprints/blueprint-delete-modal/blueprint-delete-modal-service.factory.js';
import { BlueprintDetailsFactory } from './blueprints/blueprint-details-modal/blueprint-details-modal-service.factory.js';
import { BlueprintOrderListFactory } from './blueprints/blueprint-details-modal/blueprint-order-list.service.js';
import { BrowseEntryPointFactory } from './blueprints/blueprint-details-modal/browse-entry-point-modal/browse-entry-point-modal-service.factory.js';
import { browseEntryPointDirective } from './blueprints/blueprint-details-modal/browse-entry-point-modal/browse-entry-point.directive.js';
import { CreateCatalogFactory } from './blueprints/blueprint-details-modal/create-catalog-modal/create-catalog-modal-service.factory.js';
import { OrderListDirective } from './blueprints/blueprint-details-modal/order-list.directive.js';
import { BlueprintEditorDirective } from './blueprints/blueprint-editor/blueprint-editor.directive.js';
import { draggableItemsDirective } from './blueprints/blueprint-editor/draggable-items.directive.js';
import { SaveBlueprintFactory } from './blueprints/blueprint-editor/save-blueprint-modal-service.factory.js';
import { BlueprintsListDirective } from './blueprints/blueprints-list.directive.js';
import { CatalogEditorComponent } from './catalogs/catalog-editor.component.js';
import { CatalogsListComponent } from './catalogs/catalog-list.component.js';
import { ConfirmationDirective } from './confirmation/confirmation.directive.js';
import { CustomButtonDirective } from './custom-button/custom-button.directive.js';
import { CustomDropdownComponent } from './custom-dropdown/custom-dropdown.directive.js';
import { DetailRevealComponent } from './detail-reveal/detail-reveal.component.js';
import { DialogContentComponent } from './dialog-content/dialog-content.component.js';
import { DialogsListComponent } from './dialogs/dialogs-list.component.js';
import { DualPaneSelectorComponent } from './dual-pane-selector/dual-pane-selector.component.js';
import { EditServiceModalComponent } from './edit-service-modal/edit-service-modal.component.js';

 // TODO: Refactor and move, these aren't currently part of the components module although they likely must be loaded in this order
import './flowchart/dragging_service.js';
import './flowchart/flowchart_directive.js';
import './flowchart/flowchart_viewmodel.js';
import './flowchart/mouse_capture_service.js';

import { nodeToolbarDirective } from './flowchart/node-toolbar.directive.js';
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
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component.js';
import { SSCardComponent } from './ss-card/ss-card.component.js';
import { TagEditorFactory } from './tag-editor-modal/tag-editor-modal-service.factory.js';
import { TaggingComponent } from './tagging/tagging.component.js';

export default angular
  .module('app.components', [
    'app.core',
    'ui.bootstrap',
    'patternfly',
    'svgBaseFix',
    'dndLists',
    'flowChart',
    'ngDragDrop',
    'miqStaticAssets',
  ])
  .directive('autofocus', AutofocusDirective)
  .directive('blueprintCanvas', BlueprintCanvasDirective)
  .factory('BlueprintDeleteModal', BlueprintDeleteFactory)
  .factory('BlueprintDetailsModal', BlueprintDetailsFactory)
  .factory('BlueprintOrderListService', BlueprintOrderListFactory)
  .factory('BrowseEntryPointModal', BrowseEntryPointFactory)
  .directive('browseEntryPoint', browseEntryPointDirective)
  .factory('CreateCatalogModal', CreateCatalogFactory)
  .directive('orderList', OrderListDirective)
  .directive('blueprintEditor', BlueprintEditorDirective)
  .directive('draggableItems', draggableItemsDirective)
  .factory('SaveBlueprintModal', SaveBlueprintFactory)
  .directive('blueprintsList', BlueprintsListDirective)
  .component('catalogEditor', CatalogEditorComponent)
  .component('catalogsList', CatalogsListComponent)
  .directive('confirmation', ConfirmationDirective)
  .directive('customButton', CustomButtonDirective)
  .component('customDropdown', CustomDropdownComponent)
  .component('detailReveal', DetailRevealComponent)
  .component('dialogContent', DialogContentComponent)
  .component('dialogsList', DialogsListComponent)
  .component('dualPaneSelector', DualPaneSelectorComponent)
  .component('editServiceModal', EditServiceModalComponent)
  .directive('nodeToolbar', nodeToolbarDirective)
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
  .component('shoppingCart', ShoppingCartComponent)
  .component('ssCard', SSCardComponent)
  .factory('TagEditorModal', TagEditorFactory)
  .component('taggingWidget', TaggingComponent)
  .name;

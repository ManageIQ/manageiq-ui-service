import {
  formatBytes,
  megaBytes,
} from './format-bytes.filter.js';

import { AutofocusDirective } from './autofocus.directive.js';
import { ConfirmationDirective } from './confirmation/confirmation.directive.js';
import { CustomDropdownComponent } from './custom-dropdown/custom-dropdown.component.js';
import { DialogContentComponent } from './dialog-content/dialog-content.component.js';
import { IconListComponent } from './icon-list/icon-list.component.js';
import { LoadingComponent } from './loading.component.js';
import { ModalActionsComponent } from './modal-actions/modal-actions.component.js';
import { PaginationComponent } from './pagination/pagination.component.js';
import { SSCardComponent } from './ss-card/ss-card.component.js';
import { TaggingComponent } from './tagging/tagging.component.js';
import { substitute } from './substitute.filter.js';

export const SharedModule = angular
  .module('app.shared', [
  ])
  .component('customDropdown', CustomDropdownComponent)
  .component('dialogContent', DialogContentComponent)
  .component('explorerPagination', PaginationComponent)
  .component('iconList', IconListComponent)
  .component('loading', LoadingComponent)
  .component('modalActions', ModalActionsComponent)
  .component('ssCard', SSCardComponent)
  .component('taggingWidget', TaggingComponent)
  .directive('autofocus', AutofocusDirective)
  .directive('confirmation', ConfirmationDirective)
  .filter('formatBytes', formatBytes)
  .filter('megaBytes', megaBytes)
  .filter('substitute', substitute)
  .name;

import {formatBytes, megaBytes} from './format-bytes.filter.js'
import {ActionButtonGroupComponent} from './action-button-group/action-button-group.component.js'
import {AutofocusDirective} from './autofocus.directive.js'
import {ConfirmationDirective} from './confirmation/confirmation.directive.js'
import {CustomDropdownComponent} from './custom-dropdown/custom-dropdown.component.js'
import {ElapsedTime} from './elapsedTime.filter.js'
import {IconListComponent} from './icon-list/icon-list.component.js'
import {IconStatusComponent} from './icon-status.component.js'
import {LoadingComponent} from './loading.component.js'
import {PaginationComponent} from './pagination/pagination.component.js'
import {SSCardComponent} from './ss-card/ss-card.component.js'
import {TaggingComponent} from './tagging/tagging.component.js'
import {TimelineComponent} from './timeline/timeline.component.js'
import {substitute} from './substitute.filter.js'

export const SharedModule = angular
  .module('app.shared', [
    'app.core',
    'miqStaticAssets',
    'ngFileSaver',
    'ui.bootstrap',
    'patternfly',
    'patternfly.charts',
    'patternfly.table',
    'ui.select'
  ])
  .component('actionButtonGroup', ActionButtonGroupComponent)
  .component('customDropdown', CustomDropdownComponent)
  .component('explorerPagination', PaginationComponent)
  .component('iconList', IconListComponent)
  .component('iconStatus', IconStatusComponent)
  .component('loading', LoadingComponent)
  .component('ssCard', SSCardComponent)
  .component('taggingWidget', TaggingComponent)
  .component('timeline', TimelineComponent)
  .directive('autofocus', AutofocusDirective)
  .directive('confirmation', ConfirmationDirective)
  .filter('formatBytes', formatBytes)
  .filter('megaBytes', megaBytes)
  .filter('substitute', substitute)
  .filter('elapsedTime', ElapsedTime)
  .name

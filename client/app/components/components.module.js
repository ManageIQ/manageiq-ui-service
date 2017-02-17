/* eslint-disable sort-imports */

// Services/Vms
import { CustomButtonDirective } from './custom-button/custom-button.directive.js';
import { EditServiceModalComponent } from './edit-service-modal/edit-service-modal.component.js';
import { OwnershipServiceModalComponent } from './ownership-service-modal/ownership-service-modal.component.js';
import { PowerStateComponent } from './power-state/power-state.component.js';
import { RetireRemoveServiceModalComponent } from './retire-remove-service-modal/retire-remove-service-modal.component.js';
import { RetireServiceModalComponent } from './retire-service-modal/retire-service-modal.component.js';
import { ServiceExplorerComponent } from './services/service-explorer/service-explorer.component.js';
import { ServiceDetailsComponent } from './services/service-details/service-details.component';
import { ServiceDetailsAnsibleComponent } from './services/service-details/service-details-ansible.component';
import { ServiceDetailsAnsibleModalComponent } from './services/service-details/service-details-ansible-modal.component';
import { VmSnapshotsComponent } from './vms/snapshots.component';
import { DetailRevealComponent } from './detail-reveal/detail-reveal.component.js';

// Orchestration Templates
import { TemplateExplorerComponent } from './template-explorer/template-explorer.component.js';

export default angular
  .module('app.components', [
    'app.core',
    'ui.bootstrap',
    'patternfly',
    'svgBaseFix',
    'miqStaticAssets',
  ])
  .directive('customButton', CustomButtonDirective)
  .component('detailReveal', DetailRevealComponent)
  .component('editServiceModal', EditServiceModalComponent)
  .component('ownershipServiceModal', OwnershipServiceModalComponent)
  .component('powerState', PowerStateComponent)
  .component('retireRemoveServiceModal', RetireRemoveServiceModalComponent)
  .component('retireServiceModal', RetireServiceModalComponent)
  .component('serviceExplorer', ServiceExplorerComponent)
  .component('serviceDetails', ServiceDetailsComponent)
  .component('serviceDetailsAnsible', ServiceDetailsAnsibleComponent)
  .component('serviceDetailsAnsibleModal', ServiceDetailsAnsibleModalComponent)
  .component('templateExplorer', TemplateExplorerComponent)
  .component('vmSnapshots', VmSnapshotsComponent)
  .name;

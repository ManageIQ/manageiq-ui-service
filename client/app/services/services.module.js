import { ConsolesFactory } from './consoles.service.js';
import { CustomButtonDirective } from './custom-button/custom-button.directive.js';
import { DetailRevealComponent } from './detail-reveal/detail-reveal.component.js';
import { EditServiceModalComponent } from './edit-service-modal/edit-service-modal.component.js';
import { OwnershipServiceModalComponent } from './ownership-service-modal/ownership-service-modal.component.js';
import { PowerOperationsFactory } from './poweroperations.service.js';
import { PowerStateComponent } from './power-state/power-state.component.js';
import { ProcessSnapshotsModalComponent } from './process-snapshots-modal/process-snapshots-modal.component';
import { RetireRemoveServiceModalComponent } from './retire-remove-service-modal/retire-remove-service-modal.component.js';
import { RetireServiceModalComponent } from './retire-service-modal/retire-service-modal.component.js';
import { ServiceDetailsAnsibleComponent } from './service-details/service-details-ansible.component';
import { ServiceDetailsAnsibleModalComponent } from './service-details/service-details-ansible-modal.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { ServiceExplorerComponent } from './service-explorer/service-explorer.component.js';
import { ServicesStateFactory } from './services-state.service.js';
import { SharedModule } from '../shared/shared.module.js';
import { VmSnapshotsComponent } from './vms/snapshots.component';
import { VmsService } from './vms.service.js';

export const ServicesModule = angular
  .module('app.services', [
    SharedModule,
  ])
  .directive('customButton', CustomButtonDirective)
  .component('detailReveal', DetailRevealComponent)
  .component('editServiceModal', EditServiceModalComponent)
  .component('ownershipServiceModal', OwnershipServiceModalComponent)
  .component('powerState', PowerStateComponent)
  .component('processSnapshotsModal', ProcessSnapshotsModalComponent)
  .component('retireRemoveServiceModal', RetireRemoveServiceModalComponent)
  .component('retireServiceModal', RetireServiceModalComponent)
  .component('serviceDetails', ServiceDetailsComponent)
  .component('serviceDetailsAnsible', ServiceDetailsAnsibleComponent)
  .component('serviceDetailsAnsibleModal', ServiceDetailsAnsibleModalComponent)
  .component('serviceExplorer', ServiceExplorerComponent)
  .component('vmSnapshots', VmSnapshotsComponent)
  .factory('Consoles', ConsolesFactory)
  .factory('PowerOperations', PowerOperationsFactory)
  .factory('ServicesState', ServicesStateFactory)
  .factory('VmsService', VmsService)
  .name;

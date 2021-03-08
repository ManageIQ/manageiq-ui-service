import { ConsolesFactory } from './consoles.service.js'
import { CustomButtonComponent, CustomButtonMenuComponent } from './custom-button/custom-button.component.js'
import { DetailRevealComponent } from './detail-reveal/detail-reveal.component.js'
import { EditServiceModalComponent } from './edit-service-modal/edit-service-modal.component.js'
import { GenericObjectsListComponent } from './generic-objects-list/generic-objects-list.component.js'
import { OwnershipServiceModalComponent } from './ownership-service-modal/ownership-service-modal.component.js'
import { PowerOperationsFactory } from './poweroperations.service.js'
import { ProcessSnapshotsModalComponent } from './process-snapshots-modal/process-snapshots-modal.component'
import { ResourceDetailsComponent } from './resource-details/resource-details.component'
import { RetireRemoveServiceModalComponent } from './retire-remove-service-modal/retire-remove-service-modal.component.js'
import { RetireServiceModalComponent } from './retire-service-modal/retire-service-modal.component.js'
import { ServiceDetailsAnsibleComponent } from './service-details/service-details-ansible.component'
import { ServiceDetailsAnsibleModalComponent } from './service-details/service-details-ansible-modal.component'
import { ServiceDetailsComponent } from './service-details/service-details.component'
import { ServiceExplorerComponent } from './service-explorer/service-explorer.component.js'
import { ServicesStateFactory } from './services-state.service.js'
import { SharedModule } from '../shared/shared.module.js'
import { UsageGraphsComponent } from './usage-graphs/usage-graphs.component.js'
import { UsageGraphsFactory } from './usage-graphs/usage-graphs.service.js'
import { VmPowerFactory } from './vm-power.service.js'
import { VmSnapshotsComponent } from './vms/snapshots.component'
import { VmsService } from './vms.service.js'

export const ServicesModule = angular
  .module('app.services', [
    SharedModule
  ])
  .component('customButton', CustomButtonComponent)
  .component('customButtonMenu', CustomButtonMenuComponent)
  .component('detailReveal', DetailRevealComponent)
  .component('editServiceModal', EditServiceModalComponent)
  .component('genericObjectsList', GenericObjectsListComponent)
  .component('ownershipServiceModal', OwnershipServiceModalComponent)
  .component('processSnapshotsModal', ProcessSnapshotsModalComponent)
  .component('retireRemoveServiceModal', RetireRemoveServiceModalComponent)
  .component('retireServiceModal', RetireServiceModalComponent)
  .component('resourceDetails', ResourceDetailsComponent)
  .component('serviceDetails', ServiceDetailsComponent)
  .component('serviceDetailsAnsible', ServiceDetailsAnsibleComponent)
  .component('serviceDetailsAnsibleModal', ServiceDetailsAnsibleModalComponent)
  .component('serviceExplorer', ServiceExplorerComponent)
  .component('usageGraphs', UsageGraphsComponent)
  .component('vmSnapshots', VmSnapshotsComponent)
  .factory('Consoles', ConsolesFactory)
  .factory('PowerOperations', PowerOperationsFactory)
  .factory('ServicesState', ServicesStateFactory)
  .factory('UsageGraphsService', UsageGraphsFactory)
  .factory('VmPower', VmPowerFactory)
  .factory('VmsService', VmsService)
  .name

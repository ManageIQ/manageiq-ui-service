import { OrderExplorerComponent } from './order-explorer/order-explorer.component.js'
import { OrdersStateFactory } from './orders-state.service.js'
import { ProcessOrderModalComponent } from './process-order-modal/process-order-modal.component.js'
import { RequestsStateFactory } from './requests-state.service.js'
import { SharedModule } from '../shared/shared.module.js'

export const RequestsModule = angular
  .module('app.requests', [
    SharedModule
  ])
  .component('processOrderModal', ProcessOrderModalComponent)
  .component('orderExplorer', OrderExplorerComponent)
  .factory('OrdersState', OrdersStateFactory)
  .factory('RequestsState', RequestsStateFactory)
  .name

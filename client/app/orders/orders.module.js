import { OrderExplorerComponent } from './order-explorer/order-explorer.component.js'
import { OrdersStateFactory } from './orders-state.service.js'
import { ProcessOrderModalComponent } from './process-order-modal/process-order-modal.component.js'
import { RequestsListComponent } from './request-list/requests-list.component.js'
import { SharedModule } from '../shared/shared.module.js'

export const RequestsModule = angular
  .module('app.orders', [
    SharedModule
  ])
  .component('processOrderModal', ProcessOrderModalComponent)
  .component('orderExplorer', OrderExplorerComponent)
  .component('requestsList', RequestsListComponent)
  .factory('OrdersState', OrdersStateFactory)
  .name

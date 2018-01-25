import { SharedModule } from '../shared/shared.module.js'
import { DashboardComponent } from './dashboard/dashboard.component.js'
import { DashboardComponentFactory } from './dashboard/dashboard.component.service.js'

export default angular
.module('app.components', [
  SharedModule
])
.component('dashboardComponent', DashboardComponent)
.factory('DashboardService', DashboardComponentFactory)
  .name

import { ReportsDetailsComponent } from './reports-details.component.js';
import { ReportsExplorerComponent } from './reports-explorer.component.js';
import { ReportsServiceFactory } from './reports.service.js';
import { SharedModule } from '../shared/shared.module.js';

export const ReportsModule = angular
  .module('app.reports', [
    SharedModule,
  ])
  .component('reportsDetails', ReportsDetailsComponent)
  .component('reportsExplorer', ReportsExplorerComponent)
  .factory('ReportsService', ReportsServiceFactory)
  .name;

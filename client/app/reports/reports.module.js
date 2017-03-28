import { ReportsExplorerComponent } from './reports-explorer.component.js';
import { ReportsServiceFactory } from './reports.service.js';
import { SharedModule } from '../shared/shared.module.js';

export const ReportsModule = angular
  .module('app.reports', [
    SharedModule,
  ])
  .component('reportsExplorer', ReportsExplorerComponent)
  .factory('ReportsService', ReportsServiceFactory)
  .name;

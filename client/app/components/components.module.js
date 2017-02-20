import { SharedModule } from '../shared/shared.module.js';
import { TemplateExplorerComponent } from './template-explorer/template-explorer.component.js';

export default angular
  .module('app.components', [
    SharedModule,
  ])
  .component('templateExplorer', TemplateExplorerComponent)
  .name;

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
  .component('templateExplorer', TemplateExplorerComponent)
  .name;

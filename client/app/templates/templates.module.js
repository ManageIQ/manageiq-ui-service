import { SharedModule } from '../shared/shared.module.js';
import { TemplateEditorComponent } from './template-editor.component.js';
import { TemplateExplorerComponent } from './template-explorer.component.js';
import { TemplatesServiceFactory } from './templates.service.js';

export const TemplatesModule = angular
  .module('app.templates', [
    SharedModule,
  ])
  .component('templateEditor', TemplateEditorComponent)
  .component('templateExplorer', TemplateExplorerComponent)
  .factory('TemplatesService', TemplatesServiceFactory)
  .name;

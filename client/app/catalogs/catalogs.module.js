import { CatalogEditorComponent } from './catalog-editor.component.js';
import { CatalogsListComponent } from './catalog-explorer.component';
import { CatalogsStateFactory } from './catalogs-state.service.js';
import { DualPaneSelectorComponent } from './dual-pane-selector/dual-pane-selector.component.js';
import { SharedModule } from '../shared/shared.module.js';

export const CatalogsModule = angular
  .module('app.catalogs', [
    SharedModule,
  ])
  .component('catalogEditor', CatalogEditorComponent)
  .component('catalogExplorer', CatalogsListComponent)
  .component('dualPaneSelector', DualPaneSelectorComponent)
  .factory('CatalogsState', CatalogsStateFactory)
  .name;

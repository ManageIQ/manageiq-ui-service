import { CatalogExplorerComponent } from './catalog-explorer.component.js';
import { CatalogsStateFactory } from './catalogs-state.service.js';
import { SharedModule } from '../shared/shared.module.js';

export const CatalogsModule = angular
  .module('app.catalogs', [
    SharedModule,
  ])
  .component('catalogExplorer', CatalogExplorerComponent)
  .factory('CatalogsState', CatalogsStateFactory)
  .name;

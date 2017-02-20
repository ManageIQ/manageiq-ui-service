import { ProfilesStateFactory } from './profiles-state.service.js';
import { RulesListComponent } from './rules/rules-list.component.js';
import { RulesStateFactory } from './rules/rules-state.service.js';
import { SharedModule } from '../shared/shared.module.js';

export const AdminModule = angular
  .module('app.admin', [
    SharedModule,
  ])
  .component('rulesList', RulesListComponent)
  .factory('ProfilesState', ProfilesStateFactory)
  .factory('RulesState', RulesStateFactory)
  .name;

import { DialogStateFactory } from './dialogs-state.service.js';
import { DialogsListComponent } from './dialogs-list.component.js';
import { SharedModule } from '../shared/shared.module.js';

export const DialogsModule = angular
  .module('app.dialogs', [
    SharedModule,
  ])
  .component('dialogsList', DialogsListComponent)
  .factory('DialogsState', DialogStateFactory)
  .name;

/* eslint camelcase: ["error", {properties: "never"}] */

(function() {
  'use strict';

  angular.module('app.components')
    .component('dialogEditorBoxes', {
      controller: function(DialogEditor, DialogEditorModal, lodash) {
        /**
         * Load component data
         */
        this.$onInit = function() {
          this.service = DialogEditor;
          // load data from service
          this.dialogTabs = DialogEditor.getDialogTabs();
        };

        /**
         * Add a new box to box list
         * New box automaticaly does have last position in list
         */
        this.addBox = function() {
          this.dialogTabs[DialogEditor.activeTab].dialog_groups.push({
            description: __("Description"),
            label: __("Label"),
            display: "edit",
            position: 0,
            dialog_fields: [],
          });
          DialogEditor.updatePositions(
            this.dialogTabs[DialogEditor.activeTab].dialog_groups
          );
        };

        /**
         * Delete box with all content
         */
        this.removeBox = function(id) {
          lodash.remove(
            this.dialogTabs[DialogEditor.activeTab].dialog_groups,
            function(box) {
              return box.position === id;
            }
          );
        };

        this.editDialogModal = function(tab, box) {
          DialogEditorModal.showModal(tab, box);
        };

        /**
         * Handle drag&drop event
         */
        this.droppableOptions = function(e, ui) {
          var droppedItem = angular.element(e.target).scope();

          DialogEditor.updatePositions(
            droppedItem.box.dialog_fields
          );
        };

        this.sortableOptionsBox = {
          axis: 'y',
          cancel: '.nosort',
          cursor: 'move',
          opacity: 0.5,
          revert: 50,
          stop: function(e, ui) {
            var sortedBox = ui.item.scope();

            DialogEditor.updatePositions(
              sortedBox.$parent.tab.dialog_groups
            );
          },
        };

        this.sortableOptionsFields = {
          axis: 'y',
          cancel: '.nosort',
          cursor: 'move',
          revert: 50,
          stop: function(e, ui) {
            var sortedField = ui.item.scope();

            DialogEditor.updatePositions(
              sortedField.$parent.box.dialog_fields
            );
          },
        };
      },
      controllerAs: 'dialogEditorBoxes',
      templateUrl: 'app/components/dialog-editor-boxes/dialog-editor-boxes.html',
    });
})();

(function() {
  'use strict';

  angular.module('app.components')
    .component('dialogDashboard', {
      controller: function(DialogEdit, EditDialogModal, lodash) {
        /**
         * Load component data
         */
        this.$onInit = function() {
          this.service = DialogEdit;
          // load data from service
          this.dialogTabs = DialogEdit.getData().content[0].dialog_tabs;
        };

        /**
         * Add a new box to box list
         * New box automaticaly does have last position in list
         */
        this.addBox = function() {
          this.dialogTabs[DialogEdit.activeTab].dialog_groups.push({
            description: __("Description"),
            label: __("Label"),
            display: "edit",
            position: 0,
            dialog_fields: [],
          });
          DialogEdit.updatePositions(
            this.dialogTabs[DialogEdit.activeTab].dialog_groups
          );
        };

        /**
         * Delete box with all content
         */
        this.removeBox = function(id) {
          lodash.remove(
            this.dialogTabs[DialogEdit.activeTab].dialog_groups,
            function(box) {
              return box.position === id;
            }
          );
        };

        this.editDialogModal = function(tab, box) {
          EditDialogModal.showModal(tab, box);
        };

        /**
         * Handle drag&drop event
         */
        this.droppableOptions = function(e, ui) {
          var droppedItem = angular.element(e.target).scope();

          DialogEdit.updatePositions(
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

            DialogEdit.updatePositions(
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

            DialogEdit.updatePositions(
              sortedField.$parent.box.dialog_fields
            );
          },
        };
      },
      controllerAs: 'dialogDashboard',
      templateUrl: 'app/components/dialog-dashboard/dialog-dashboard.html'
    });
})();

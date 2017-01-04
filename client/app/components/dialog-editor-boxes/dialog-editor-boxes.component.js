/* eslint camelcase: ["error", {properties: "never"}] */

(function() {
  'use strict';

  angular.module('app.components')
    .component('dialogEditorBoxes', {
      controller: ComponentController,
      controllerAs: 'vm',
      templateUrl: 'app/components/dialog-editor-boxes/dialog-editor-boxes.html',
    });

  function ComponentController(DialogEditor, DialogEditorModal, lodash) {
    var vm = this;

    /**
     * Load Dialog data
     */
    vm.$onInit = function() {
      // to be able to access the service from the template
      vm.service = DialogEditor;
      // load data from service
      vm.dialogTabs = DialogEditor.getDialogTabs();
    };

    /**
     * Add a new empty box to box list
     * New box automaticaly does have last position in list
     */
    vm.addBox = function() {
      vm.dialogTabs[DialogEditor.activeTab].dialog_groups.push({
        description: __("Description"),
        label: __("Label"),
        display: "edit",
        position: 0,
        dialog_fields: [],
      });
      DialogEditor.updatePositions(
        vm.dialogTabs[DialogEditor.activeTab].dialog_groups
      );
    };

    /**
     * Delete box with all its content
     *
     * Parameter: id -- id of the box to remove
     */
    vm.removeBox = function(id) {
      lodash.remove(
        vm.dialogTabs[DialogEditor.activeTab].dialog_groups,
        function(box) {
          return box.position === id;
        }
      );
      DialogEditor.updatePositions(
        vm.dialogTabs[DialogEditor.activeTab].dialog_groups
      );
    };

    /**
     * Show modal to edit label and description of the Box
     *
     * Parameter: tab -- id of the tab in the dialog
     * Parameter: box -- id of the box in the tab
     */
    vm.editDialogModal = function(tab, box) {
      DialogEditorModal.showModal(tab, box);
    };

    /**
     * Handle drag&drop event
     */
    vm.droppableOptions = function(e, ui) {
      var droppedItem = angular.element(e.target).scope();

      DialogEditor.updatePositions(
        droppedItem.box.dialog_fields
      );
    };

    vm.sortableOptionsBox = {
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

    vm.sortableOptionsFields = {
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
  }
})();

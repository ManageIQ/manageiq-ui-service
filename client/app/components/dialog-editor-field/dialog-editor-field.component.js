(function() {
  'use strict';

  angular.module('app.components')
    .component('dialogEditorField', {
      bindings: {
        fieldData: '<',
        boxPosition: '<',
      },
      controller: ComponentController,
      controllerAs: 'vm',
      templateUrl: 'app/components/dialog-editor-field/dialog-editor-field.html',
    });

  function ComponentController(DialogEditor, DialogEditorModal) {
    var vm = this;

    vm.service = DialogEditor;

    /**
     * Show modal to edit details of the field
     *
     * Parameter: tab -- id of the tab in the dialog
     * Parameter: box -- id of the box in the tab
     * Parameter: field -- id of the field in the box
     */
    vm.editDialogModal = function(tab, box, field) {
      DialogEditorModal.showModal(tab, box, field);
    };
  }
})();

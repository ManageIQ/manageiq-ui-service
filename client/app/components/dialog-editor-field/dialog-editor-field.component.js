(function() {
  'use strict';

  angular.module('app.components')
    .component('dialogEditorField', {
      bindings: {
        fieldData: '=',
        boxPosition: '=',
      },
      controller: function(DialogEditor, DialogEditorModal) {
        this.service = DialogEditor;

        this.editDialogModal = function(tab, box, field) {
          DialogEditorModal.showModal(tab, box, field);
        };
      },
      controllerAs: 'dialogEditorField',
      templateUrl: 'app/components/dialog-editor-field/dialog-editor-field.html',
    });
})();

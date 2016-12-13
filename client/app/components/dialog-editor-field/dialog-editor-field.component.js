(function() {
  'use strict';

  angular.module('app.components')
    .component('dialogEditorField', {
      bindings: {
        fieldData: '=',
        boxPosition: '=',
      },
      controller: ComponentController,
      controllerAs: 'vm',
      templateUrl: 'app/components/dialog-editor-field/dialog-editor-field.html',
    });
  function ComponentController(DialogEditor, DialogEditorModal) {
    var vm = this;

    vm.service = DialogEditor;
    vm.editDialogModal = function(tab, box, field) {
      DialogEditorModal.showModal(tab, box, field);
    };
  }
})();

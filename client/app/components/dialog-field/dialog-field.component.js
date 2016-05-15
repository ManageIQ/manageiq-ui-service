(function() {
  'use strict';

  angular.module('app.components')
    .component('dialogField', {
      bindings: {
        fieldData: '=',
        boxPosition: '=',
      },
      controller: function(DialogEdit, EditDialogModal) {
        this.service = DialogEdit;

        this.editDialogModal = function(tab, box, field) {
          EditDialogModal.showModal(tab, box, field);
        };
      },
      controllerAs: 'dialogField',
      templateUrl: 'app/components/dialog-field/dialog-field.html'
    });
})();

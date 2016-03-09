(function() {
  'use strict';

  angular.module('app.components')
    .component('dialogField', {
      bindings: {
        fieldData: '=',
        boxPosition: '=',
      },
      controller: function(EditDialogModal) {
        this.editDialogModal = function(box, field) {
          EditDialogModal.showModal(box, field);
        };
      },
      controllerAs: 'dialogField',
      templateUrl: 'app/components/dialog-field/dialog-field.html'
    });
})();

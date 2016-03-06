(function() {
  'use strict';

  angular.module('app.components')
    .component('dialogField', {
      bindings: {
        fieldData: '=',
      },
      controllerAs: 'dialogField',
      templateUrl: 'app/components/dialog-field/dialog-field.html'
    });
})();

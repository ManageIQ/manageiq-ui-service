(function() {
  'use strict';

  angular.module('app.components')
    .directive('dialogEditorModalFieldTemplate', function() {
      return {
        templateUrl: function(tElement, tAttrs) {
          return 'app/components/dialog-editor-modal-field-template/' + tAttrs.template;
        },
        scope: true,
      };
    });
})();

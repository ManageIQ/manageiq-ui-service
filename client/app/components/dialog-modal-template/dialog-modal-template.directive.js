(function() {
  'use strict';

  angular.module('app.components')
    .directive('dialogModalTemplate', function() {
      return {
        templateUrl: function(tElement, tAttrs) {
          return 'app/components/dialog-modal-template/' + tAttrs.template;
        },
        scope: true,
      };
    });
})();

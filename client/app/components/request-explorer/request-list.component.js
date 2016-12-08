(function() {
  'use strict';

  angular.module('app.components')
    .component('requestList', {
      bindings: {
        'items': '<',
        'config': '<?',
      },
      templateUrl: 'app/components/requests-explorer/requests-explorer.html',
      controller: ComponentController,
      controllerAs: 'vm',
    });


  /** @ngInject */
  function ComponentController() {
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('requestList', RequestListDirective);

  /** @ngInject */
  function RequestListDirective() {
    var directive = {
      restrict: 'E',
      scope: {
        'items': '<',
        'config': '<?',
      },
      templateUrl: 'app/components/request-list/request-list.html',
      controller: RequestListController,
      controllerAs: 'vm',
      bindToController: true,
    };

    return directive;

    /** @ngInject */
    function RequestListController() {
      var vm = this;
    }
  }
})();

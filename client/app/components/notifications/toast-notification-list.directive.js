(function() {
  'use strict';

  angular.module('app.components')
    .directive('toastNotificationList', ToastNotificationListDirective);

  /** @ngInject */
  function ToastNotificationListDirective() {
    var directive = {
      restrict: 'AE',
      replace: true,
      scope: true,
      templateUrl: 'app/components/notifications/toast-notification-list.html',
      controller: ToastNotificationListController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ToastNotificationListController($scope, EventNotifications) {
      var vm = this;
      refresh();

      function refresh() {
        vm.toastNotifications = EventNotifications.state().toastNotifications;
      }

      var destroy = $scope.$watch(function() {
          return EventNotifications.state().toastNotifications;
        },
        refresh, true);

      $scope.$on('destroy', destroy);
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('toastNotification', ToastNotificationDirective);

  /** @ngInject */
  function ToastNotificationDirective() {
    var directive = {
      restrict: 'AE',
      replace: true,
      scope: {
        'notification': '=',
        'notificationIndex': '='
      },
      templateUrl: 'app/components/notifications/toast-notification.html',
      controller: ToastNotificationController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ToastNotificationController($scope, EventNotifications) {
      var vm = this;

      vm.notificationType = vm.notification.status;
      if (vm.notificationType === 'error') {
        vm.notificationType = 'danger';
      } else if (vm.notificationType === 'ok') {
        vm.notificationType = 'success';
      }

      vm.handleEnter = function() {
        EventNotifications.setViewingToast(vm.notification, true);
      };

      vm.handleLeave = function() {
        EventNotifications.setViewingToast(vm.notification, false);
      };

      vm.handleDismiss = function() {
        EventNotifications.markRead(vm.notification);
        EventNotifications.dismissToast(vm.notification, false);
      };
    }
  }
})();

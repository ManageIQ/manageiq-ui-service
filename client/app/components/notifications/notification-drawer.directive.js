(function() {
  'use strict';

  angular.module('app.components')
    .directive('notificationDrawer', NotificationDrawerDirective);

  /** @ngInject */
  function NotificationDrawerDirective() {
    var directive = {
      restrict: 'AE',
      replace: true,
      scope: {
        shown: '='
      },
      templateUrl: 'app/components/notifications/notification-drawer.html',
      link: link,
      controller: NotificationDrawerController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function NotificationDrawerController($scope, EventNotifications) {
      var vm = this;

      vm.drawerExpanded = false;
      vm.activate = activate;
      vm.getNotficationStatusIconClass = getNotficationStatusIconClass;
      vm.markNotificationRead = markNotificationRead;
      vm.clearNotification = clearNotification;
      vm.clearAllNotifications = clearAllNotifications;
      vm.toggleExpandDrawer = toggleExpandDrawer;
      vm.titleHtml = 'app/components/notifications/drawer-title.html';
      vm.headingHTML = 'app/components/notifications/heading.html';
      vm.notificationHTML = 'app/components/notifications/notification-body.html';
      vm.notificationFooterHTML = 'app/components/notifications/notification-footer.html';

      function activate() {
        refresh();
      }

      function refresh() {
        vm.notificationGroups = EventNotifications.state().groups;
        vm.newNotifications = vm.notificationGroups.find(function(group) {
            return group.unreadCount > 0;
          }) !== undefined;
      }

      var destroy = $scope.$watch(function() {
          return EventNotifications.state().groups;
        },
        refresh, true);

      $scope.$on('destroy', destroy);

      function getNotficationStatusIconClass(notification) {
        var retClass = '';
        if (notification && notification.data && notification.data.status) {
          if (notification.data.status === 'info') {
            retClass = "pficon pficon-info";
          } else if (notification.data.status === 'error') {
            retClass = "pficon pficon-error-circle-o";
          } else if (notification.data.status === 'warning') {
            retClass = "pficon pficon-warning-triangle-o";
          } else if (notification.data.status === 'success') {
            retClass = "pficon pficon-ok";
          }
        }

        return retClass;
      }

      function markNotificationRead(notification, group) {
        EventNotifications.markRead(notification, group);
      }

      function clearNotification(notification, group) {
        EventNotifications.clear(notification, group);
      }

      function clearAllNotifications(group) {
        EventNotifications.clearAll(group);
      }

      function toggleExpandDrawer() {
        vm.drawerExpanded = !vm.drawerExpanded;
      }
    }
  }
})();

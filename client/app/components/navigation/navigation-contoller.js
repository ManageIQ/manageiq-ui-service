(function() {
  'use strict';

  angular.module('app.components').controller('navigationController', [
    'Text',
    'Navigation',
    'Messages',
    'Session',
    'API_BASE',
    'ShoppingCart',
    '$scope',
    '$modal',
    '$state',
    'EventNotifications',
    NavigationCtrl]);

  /** @ngInject */
  function NavigationCtrl(Text,
                          Navigation,
                          Messages,
                          Session,
                          API_BASE,
                          ShoppingCart,
                          $scope,
                          $modal,
                          $state,
                          EventNotifications) {
    var vm = this;
    vm.text = Text.app;
    vm.user = Session.currentUser;

    vm.activate = activate;
    vm.handleItemClick = handleItemClick;
    vm.clearMessages = clearMessages;
    vm.API_BASE = API_BASE;
    vm.group_switch = Session.switchGroup;

    function clearActiveItems() {
      angular.forEach(vm.items, function(item) {
        item.isActive = false;
        if (item.children) {
          angular.forEach(item.children, function(secondary) {
            secondary.isActive = false;
            if (secondary.children) {
              secondary.children.forEach(function(tertiary) {
                tertiary.isActive = false;
              });
            }
          });
        }
      });
    }

    function setActiveItems() {
      angular.forEach(vm.items, function(topLevel) {
        if ($state.includes(topLevel.state)) {
          topLevel.isActive = true;
        }
        if (topLevel.children) {
          angular.forEach(topLevel.children, function(secondLevel) {
            if ($state.includes(secondLevel.state)) {
              secondLevel.isActive = true;
              topLevel.isActive = true;
            }
            if (secondLevel.children) {
              angular.forEach(secondLevel.children, function(thirdLevel) {
                if ($state.includes(thirdLevel.state)) {
                  thirdLevel.isActive = true;
                  secondLevel.isActive = true;
                  topLevel.isActive = true;
                }
              });
            }
          });
        }
      });
    }

    $scope.$on("$stateChangeSuccess", function() {
      clearActiveItems();
      setActiveItems();
    });

    vm.shoppingCart = {
      count: 0,
      open: function() {
        return $modal.open({
          template: '<shopping-cart modal-instance="modalInstance"></shopping-cart>',
          size: 'lg',
          controller: function($scope, $modalInstance) {
            $scope.modalInstance = $modalInstance;
          },
        }).result;
      },
      allowed: ShoppingCart.allowed,
    };

    vm.notificationsDrawerShown = false;
    vm.toggleNotificationsList = toggleNotificationsList;
    vm.newNotifications = false;
    vm.getNotficationStatusIconClass = getNotficationStatusIconClass;
    vm.markNotificationRead = markNotificationRead;
    vm.clearNotification = clearNotification;
    vm.clearAllNotifications = clearAllNotifications;
    vm.markAllRead = markAllRead;
    vm.titleHtml = 'app/components/notifications/drawer-title.html';
    vm.headingHTML = 'app/components/notifications/heading.html';
    vm.notificationHTML = 'app/components/notifications/notification-body.html';
    vm.notificationFooterHTML = 'app/components/notifications/notification-footer.html';
    vm.updateViewingToast = updateViewingToast;
    vm.handleDismissToast = handleDismissToast;

    function getNavigationItems(items) {
      vm.items.splice(0, vm.items.length);
      angular.forEach(items, function(nextPrimary) {
        vm.items.push(nextPrimary);
        if (nextPrimary.children) {
          nextPrimary.children.splice(0, nextPrimary.children.length);
        }
        if (nextPrimary.secondary) {
          if (angular.isUndefined(nextPrimary.children)) {
            nextPrimary.children = [];
          }
          angular.forEach(nextPrimary.secondary, function(nextSecondary) {
            nextPrimary.children.push(nextSecondary);
          });
        }
      });
    }

    function activate() {
      vm.messages = Messages.items;
      vm.state = Navigation.state;
      vm.items = [];

      getNavigationItems(Navigation.items);
      refresh();

      if (ShoppingCart.allowed()) {
        ShoppingCart.reload();
      }
      setActiveItems();
    }

    function refreshCart() {
      vm.shoppingCart.count = ShoppingCart.count();
    }

    function refreshNotifications() {
      vm.notificationGroups = EventNotifications.state().groups;
      vm.newNotifications = angular.isDefined(vm.notificationGroups.find(function(group) {
        return group.unreadCount > 0;
      }));
    }

    function refreshToast() {
      vm.toastNotifications = EventNotifications.state().toastNotifications;
    }

    function refresh() {
      refreshCart();
      refreshNotifications();
      refreshToast();
    }

    var destroyCart = $scope.$on('shoppingCartUpdated', refreshCart);

    var destroyNotifications = $scope.$watch(function() {
      return EventNotifications.state().groups;
    },
      refreshNotifications, true);

    var destroyToast = $scope.$watch(function() {
      return EventNotifications.state().toastNotifications;
    },
      refreshToast, true);

    var destroy = $scope.$on('shoppingCartUpdated', refresh);

    $scope.$on('destroy', function() {
      destroyCart();
      destroyNotifications();
      destroyToast();
    });

    function handleItemClick(item) {
      $state.transitionTo(item.state);
    }

    function clearMessages() {
      Messages.clear();
    }

    function toggleNotificationsList() {
      vm.notificationsDrawerShown = !vm.notificationsDrawerShown;
    }

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

    function markAllRead(group) {
      EventNotifications.markAllRead(group);
    }

    function updateViewingToast(viewing, notification) {
      EventNotifications.setViewingToast(notification, viewing);
    }

    function handleDismissToast(notification) {
      EventNotifications.dismissToast(notification);
    }

    activate();
  }
})();

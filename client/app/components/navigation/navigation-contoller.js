/* eslint no-unused-vars: 0*/

(function() {
  'use strict';

  angular.module('app.components').controller('NavigationController', [
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
    'ServerInfo',
    'ProductInfo',
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
                          EventNotifications,
                          ServerInfo,
                          ProductInfo) {
    var vm = this;
    vm.text = Text.app;
    vm.user = Session.currentUser;

    vm.activate = activate;
    vm.handleItemClick = handleItemClick;
    vm.clearMessages = clearMessages;
    vm.API_BASE = API_BASE;
    vm.groupSwitch = Session.switchGroup;

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

    vm.about = {
      isOpen: false,
      additionalInfo: "",
      imgAlt: __("Product logo"),
      imgSrc: "images/login-screen-logo.png",
      title: Text.app.name,
    };

    ServerInfo.promise.then( function() {
      vm.about.productInfo = [
        { name: __('Version: '), value: ServerInfo.data.version },
        { name: __('Server Name: '), value: ServerInfo.data.server },
        { name: __('User Name: '), value: ServerInfo.data.user },
        { name: __('User Role: '), value: ServerInfo.data.role },
      ];
    });
    ProductInfo.promise.then( function() {
      vm.about.copyright = ProductInfo.data.copyright;
      vm.about.supportWebsiteText = ProductInfo.data.supportWebsiteText;
      vm.about.supportWebsite = ProductInfo.data.supportWebsite;
    });
    vm.openAbout = function() {
      vm.about.isOpen = true;
    };
    vm.onCloseAbout = function() {
      vm.about.isOpen = false;
    };

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
      vm.newNotifications = EventNotifications.state().unreadNotifications;
      vm.unreadNotificationCount = 0;
      angular.forEach(vm.notificationGroups, function(group) {
        vm.unreadNotificationCount += group.unreadCount;
      });
      vm.notificationsIndicatorTooltip = __(vm.unreadNotificationCount + " unread notifications");
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
      if (notification && notification.type) {
        if (notification.type === 'info') {
          retClass = "pficon pficon-info";
        } else if (notification.type === 'error') {
          retClass = "pficon pficon-error-circle-o";
        } else if (notification.type === 'warning') {
          retClass = "pficon pficon-warning-triangle-o";
        } else if (notification.type === 'success') {
          retClass = "pficon pficon-ok";
        } else {
          retClass = "pficon pficon-info";  // default to info
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

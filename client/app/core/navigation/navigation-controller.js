/** @ngInject */
export function NavigationController(Text,
                                     Navigation,
                                     Session,
                                     API_BASE,
                                     ShoppingCart,
                                     $scope,
                                     $uibModal,
                                     $state,
                                     EventNotifications,
                                     ApplianceInfo) {
  const vm = this;

  const applianceInfo = ApplianceInfo.get();

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
      return $uibModal.open({
        template: '<shopping-cart modal-instance="vm.modalInstance"></shopping-cart>',
        size: 'lg',
        controller: function($uibModalInstance) {
          var vm = this;
          vm.modalInstance = $uibModalInstance;
        },
        controllerAs: 'vm',
        bindToController: true,

      }).result;
    },
    allowed: ShoppingCart.allowed,
  };

  vm.notificationsDrawerShown = false;
  vm.toggleNotificationsList = toggleNotificationsList;
  vm.newNotifications = false;
  vm.closeMenus = closeMenus;
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
    productInfo: [
      {name: __('Version: '), value: applianceInfo.version},
      {name: __('Server Name: '), value: applianceInfo.server},
      {name: __('User Name: '), value: applianceInfo.user},
      {name: __('User Role: '), value: applianceInfo.role},
    ],
    copyright: applianceInfo.copyright,
    supportWebsiteText: applianceInfo.supportWebsiteText,
    supportWebsite: applianceInfo.supportWebsite,
  };

  vm.sites = [{
    title: __('Administration UI'),
    tooltip: __('Log into the full administrative UI'),
    iconClass: 'fa-cogs',
    url: vm.API_BASE,
  }];

  function getNavigationItems(items) {
    vm.items.splice(0, vm.items.length);
    angular.forEach(items, function(nextPrimary) {
      if (nextPrimary.show !== false) {
        getTextForNavigationItems(nextPrimary);
        vm.items.push(nextPrimary);
        if (nextPrimary.children) {
          nextPrimary.children.splice(0, nextPrimary.children.length);
        }
        if (nextPrimary.secondary) {
          if (angular.isUndefined(nextPrimary.children)) {
            nextPrimary.children = [];
          }
          angular.forEach(nextPrimary.secondary, function(nextSecondary) {
            if (nextSecondary.show !== false) {
              getTextForNavigationItems(nextSecondary);
              nextPrimary.children.push(nextSecondary);
            }
          });
        }
      }
    });
  }

  function getTextForNavigationItems(navItem) {
    if (angular.isDefined(navItem.originalTitle)) {
      navItem.title = __(navItem.originalTitle);
    }
    if (angular.isDefined(navItem.badges)) {
      angular.forEach(navItem.badges, function(badge) {
        badge.tooltip = __(badge.originalTooltip);
      });
    }
  }

  function activate() {
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

  const destroyCart = $scope.$on('shoppingCartUpdated', refreshCart);

  const destroyNotifications = $scope.$watch(
    function() {
      return EventNotifications.state().groups;
    },
    refreshNotifications, true);

  const destroyToast = $scope.$watch(
    function() {
      return EventNotifications.state().toastNotifications;
    },
    refreshToast, true);

  const destroy = $scope.$on('shoppingCartUpdated', refresh);

  $scope.$on('destroy', function() {
    destroyCart();
    destroyNotifications();
    destroyToast();
    destroy();
  });

  function handleItemClick(item) {
    $state.transitionTo(item.state);
  }

  function toggleNotificationsList() {
    vm.notificationsDrawerShown = !vm.notificationsDrawerShown;
  }

  function closeMenus() {
    vm.helpOpen = false;
    vm.adminOpen = false;
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

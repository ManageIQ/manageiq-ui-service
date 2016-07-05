(function() {
  'use strict';

  angular.module('app.components')
    .directive('headerNav', HeaderNavDirective);

  /** @ngInject */
  function HeaderNavDirective() {
    var directive = {
      restrict: 'AE',
      replace: true,
      scope: {},
      link: link,
      templateUrl: 'app/components/navigation/header-nav.html',
      controller: HeaderNavController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function HeaderNavController(Text, Navigation, Messages, Session, API_BASE, ShoppingCart, $rootScope, $scope, $modal, EventNotifications) {
      var vm = this;

      vm.text = Text.app;
      vm.user = Session.currentUser;

      vm.activate = activate;
      vm.toggleNavigation = toggleNavigation;
      vm.clearMessages = clearMessages;
      vm.API_BASE = API_BASE;
      vm.group_switch = Session.switchGroup;

      vm.shoppingCart = {
        count: 0,
        open: function() {
          // TODO:: Remove this. Used to create a mock event for testing
          var notificationData = {
            status: 'warning',
            message: 'Shopping cart has been emptied!'
          };
          EventNotifications.add('event', notificationData.status, notificationData.message, notificationData);

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

      function activate() {
        vm.messages = Messages.items;
        refresh();

        if (ShoppingCart.allowed()) {
          ShoppingCart.reload();
        }
      }

      function refreshCart() {
        vm.shoppingCart.count = ShoppingCart.count();
      }

      function refreshUnreadNotifications() {
        vm.newNotifications = EventNotifications.state().unreadNotifications;
      }

      function refresh() {
        refreshCart();
        refreshUnreadNotifications();
      }

      var destroyCart = $rootScope.$on('shoppingCartUpdated', refreshCart);

      var destroyUnreadNotifications = $scope.$watch(function() {
          return EventNotifications.state().unreadNotifications;
        },
        refreshUnreadNotifications,
        true);

      $scope.$on('destroy', function() {
        destroyCart();
        destroyUnreadNotifications();
      });

      function toggleNavigation() {
        if (!Navigation.state.isMobileNav) {
          Navigation.state.isCollapsed = !Navigation.state.isCollapsed;
          Navigation.state.forceCollapse = true;
        } else {
          Navigation.state.showMobileNav = !Navigation.state.showMobileNav;
        }
      }

      function clearMessages() {
        Messages.clear();
      }

      function toggleNotificationsList() {
        vm.notificationsDrawerShown = !vm.notificationsDrawerShown;
      }
    }
  }
})();

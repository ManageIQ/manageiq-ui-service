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
    function HeaderNavController(Text, Navigation, Messages, Session, API_BASE, ShoppingCart, $rootScope, $scope, $modal) {
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
          return $modal.open({
            template: '<shopping-cart></shopping-cart>',
            size: 'lg',
          }).result;
        },
      };

      function activate() {
        vm.messages = Messages.items;
        refresh();
      }

      function refresh() {
        vm.shoppingCart.count = ShoppingCart.count();
      }

      var destroy = $rootScope.$on('shoppingCartUpdated', refresh);
      $scope.$on('destroy', function() {
        destroy();
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
    }
  }
})();

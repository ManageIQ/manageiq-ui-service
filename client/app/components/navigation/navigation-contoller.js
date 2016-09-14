(function() {
  'use strict';

  angular.module('app.components').controller('navigationController', [
    'Text',
    'Navigation',
    'Messages',
    'Session',
    'API_BASE',
    'ShoppingCart',
    '$rootScope',
    '$scope',
    '$modal',
    '$state', NavigationCtrl]);

  /** @ngInject */
  function NavigationCtrl(Text,
                          Navigation,
                          Messages,
                          Session,
                          API_BASE,
                          ShoppingCart,
                          $rootScope,
                          $scope,
                          $modal,
                          $state) {
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

    $rootScope.$on("$stateChangeSuccess", function() {
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

    function refresh() {
      vm.shoppingCart.count = ShoppingCart.count();
    }

    var destroy = $rootScope.$on('shoppingCartUpdated', refresh);
    $scope.$on('destroy', function() {
      destroy();
    });

    function handleItemClick(item) {
      $state.transitionTo(item.state);
    }

    function clearMessages() {
      Messages.clear();
    }

    activate();
  }
})();

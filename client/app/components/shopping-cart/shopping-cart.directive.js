(function() {
  'use strict';

  angular.module('app.components')
    .directive('shoppingCart', ShoppingCartDirective);

  /** @ngInject */
  function ShoppingCartDirective(EventNotifications) {
    var directive = {
      restrict: 'E',
      scope: {
        'modalInstance': '<?',
      },
      link: link,
      templateUrl: 'app/components/shopping-cart/shopping-cart.html',
      controller: ShoppingCartController,
      controllerAs: 'vm',
      bindToController: true,
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ShoppingCartController(ShoppingCart, $scope, $rootScope) {
      var vm = this;

      vm.activate = refresh;
      vm.submit = submit;
      vm.close = close;

      vm.clear = ShoppingCart.reset;
      vm.remove = ShoppingCart.removeItem;

      vm.state = null;

      function refresh() {
        vm.state = ShoppingCart.state();
      }

      function submit() {
        ShoppingCart.submit()
        .then(function() {
          EventNotifications.success(__('Shopping cart successfully ordered'));
          vm.modalInstance.dismiss();
        })
        .then(null, function(err) {
          EventNotifications.error(__('There was an error submitting this request: ') + err);
        });
      }

      function close() {
        vm.modalInstance.dismiss();
      }

      var destroy = $rootScope.$on('shoppingCartUpdated', refresh);
      $scope.$on('destroy', function() {
        destroy();
      });
    }
  }
})();

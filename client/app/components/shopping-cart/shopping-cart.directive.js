(function() {
  'use strict';

  angular.module('app.components')
    .directive('shoppingCart', ShoppingCartDirective);

  /** @ngInject */
  function ShoppingCartDirective() {
    var directive = {
      restrict: 'E',
      scope: {
        'modalInstance': '<?',
      },
      link: link,
      templateUrl: 'app/components/shopping-cart/shopping-cart.html',
      controller: ShoppingCartController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ShoppingCartController(ShoppingCart, $scope, $rootScope) {
      var vm = this;

      vm.activate = activate;
      vm.submit = submit;
      vm.close = close;
      vm.clear = ShoppingCart.reset;
      vm.state = null;

      function activate() {
        vm.state = ShoppingCart.state();
      }

      function submit() {
        console.log('submit', vm.state);

        vm.modalInstance.dismiss();
      }

      function close() {
        vm.modalInstance.dismiss();
      }

      var destroy = $rootScope.$on('shoppingCartUpdated', activate);
      $scope.$on('destroy', function() {
        destroy();
      });
    }
  }
})();

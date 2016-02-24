(function() {
  'use strict';

  angular.module('app.components')
    .directive('shoppingCart', ShoppingCartDirective);

  /** @ngInject */
  function ShoppingCartDirective() {
    var directive = {
      restrict: 'AE',
      replace: true,
      scope: {},
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
    function ShoppingCartController() {
      var vm = this;

      vm.activate = activate;

      function activate() {
        vm.state = null;
      }
    }
  }
})();

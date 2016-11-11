(function() {
  'use strict';

  angular.module('app.components')
    .component('shoppingCart',
      {
        controller: ComponentController,
        controllerAs: 'vm',
        bindings: {
          modalInstance: '<?',
        },
        templateUrl: 'app/components/shopping-cart/shopping-cart.html',
      });

  /** @ngInject */
  function ComponentController(ShoppingCart, EventNotifications) {
    var vm = this;

    vm.$doCheck = refresh;

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
  }
})();

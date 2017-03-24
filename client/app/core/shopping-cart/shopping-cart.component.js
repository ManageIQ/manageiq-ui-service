import './_shopping-cart.scss';
import templateUrl from './shopping-cart.html';

export const ShoppingCartComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    modalInstance: '<?',
  },
  templateUrl,
};

/** @ngInject */
function ComponentController($state, ShoppingCart, EventNotifications) {
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
        $state.go('orders');
      })
      .then(null, function(err) {
        EventNotifications.error(__('There was an error submitting this request: ') + err);
      });
  }

  function close() {
    vm.modalInstance.dismiss();
  }
}

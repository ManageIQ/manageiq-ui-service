import './_shopping-cart.sass'
import template from './shopping-cart.html';

export const ShoppingCartComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    modalInstance: '<?'
  },
  template,
}

/** @ngInject */
function ComponentController ($state, ShoppingCart, EventNotifications) {
  const vm = this

  vm.$doCheck = refresh

  vm.submit = submit
  vm.close = close
  vm.clear = ShoppingCart.reset
  vm.remove = ShoppingCart.removeItem
  vm.state = null

  /**
  * Refreshes shopping cart state
  * @function refresh
  */
  function refresh () {
    vm.state = ShoppingCart.state()
  }

  /**
  * Submits a shopping cart
  * @function submit
  * @returns Promise
  */
  function submit () {
    return ShoppingCart.submit()
      .then(function () {
        EventNotifications.success(__('Shopping cart successfully ordered'))
        vm.modalInstance.close()
        $state.go('orders')
      })
      .then(null, function (err) {
        EventNotifications.error(__('There was an error submitting this request: ') + err)
      })
  }

  /**
  * closes a shopping cart modal
  * @function close
  */
  function close () {
    vm.modalInstance.close()
  }
}

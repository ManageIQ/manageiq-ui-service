(function() {
  'use strict';

  angular.module('app.services')
  .factory('ShoppingCart', ShoppingCartFactory);

  /** @ngInject */
  function ShoppingCartFactory($rootScope) {
    var state = null;

    var service = {
      add: add,
      reset: reset,
      count: count,
      state: function() { return state; },
    };

    reset();

    return service;

    function add(item) {
      state.items.push(item);
      notify();
    }

    function reset() {
      state = {
        items: [],
      };
      notify();
    }

    function count() {
      return state.items.length;
    }

    function notify() {
      $rootScope.$broadcast('shoppingCartUpdated');
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.services')
  .factory('ShoppingCart', ShoppingCartFactory);

  /** @ngInject */
  function ShoppingCartFactory($rootScope) {
    var model = null;

    var service = {
      add: add,
      reset: reset,
      count: count,
    };

    reset();

    return service;

    function add(item) {
      model.items.push(item);
      notify();
    }

    function reset() {
      model = {
        items: [],
      };
      notify();
    }

    function count() {
      return model.items.length;
    }

    function notify() {
      $rootScope.$broadcast('shoppingCartUpdated');
    }
  }
})();

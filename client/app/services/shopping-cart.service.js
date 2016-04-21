(function() {
  'use strict';

  angular.module('app.services')
  .factory('ShoppingCart', ShoppingCartFactory);

  /** @ngInject */
  function ShoppingCartFactory($rootScope, CollectionsApi, $q, $http, lodash, RBAC) {
    var state = null;

    var service = {
      add: add,
      reset: reset,
      reload: reload,
      count: count,
      removeItem: removeItem,
      submit: submit,
      state: function() {
        return state;
      },
      allowed: allowed,
    };

    var persistence = {
      // FIXME this one is broken, waiting for the API
      // ensure a cart exists, and return its id
      cartId: function() {
        return CollectionsApi.query('service_orders', {
          expand: 'resources',
          filter: [ 'state=cart' ],
        })
        .then(function(response) {
          if (response.resources && response.resources.length) {
            return response.resources[0].id;
          } else {
            return CollectionsApi.post('service_orders', null, {}, { state: "cart" })
            .then(function(response) {
              return response.results[0].id;
            });
          }
        });
      },

      // an array of items already in the basket
      getItems: function(serviceOrderId) {
        var path = 'service_orders/' + serviceOrderId + '/service_requests';

        return CollectionsApi.query(path, { expand: 'resources' })
        .then(function(response) {
          return response.resources || [];
        });
      },

      // order the cart
      orderCart: function(serviceOrderId) {
        return CollectionsApi.post('service_orders', serviceOrderId, null, {
          action: 'order',
        });
      },

      // clear the cart
      clearCart: function(serviceOrderId) {
        return CollectionsApi.post('service_orders', serviceOrderId, null, {
          action: 'clear',
        });
      },

      // remove a thingy from the cart
//      removeItem: function(serviceOrderId, thingyId) {
        // TODO
//      },

      // add a thingy to the cart
      addItem: function(serviceOrderId, thingy) {
        // TODO
      },

      // TODO remove
      removeItem: function(item) {
        return $http.delete(item.href);
      },
    };

    doReset();

    return service;

    function add(item) {
      state.items.push(item);
      notify();
    }

    function reload() {
      var serviceOrderId = null;

      persistence.cartId()
      .then(function(id) {
        serviceOrderId = id;

        return persistence.getItems(id);
      })
      .then(function(items) {
        state = {
          serviceOrderId: serviceOrderId,
          items: lodash.cloneDeep(items),
        };

        notify();
      });
    }

    function doReset() {
      state = {
        serviceOrderId: null,
        items: [],
      };
    }

    function reset() {
      return persistence.clearCart(state.serviceOrderId)
      .then(reload);
    }

    function removeItem(item) {
      // FIXME
      persistence.removeItem(item)
      .then(function() {
        state.items = lodash.filter(state.items, function(i) {
          return i !== item;
        });

        notify();
      });
    }

    function submit() {
      return persistence.orderCart(state.serviceOrderId)
      .then(reload);
    }

    function count() {
      return state.items.length;
    }

    function notify() {
      $rootScope.$broadcast('shoppingCartUpdated');
    }

    function allowed() {
      return RBAC.has('svc_catalog_provision');
    }
  }
})();

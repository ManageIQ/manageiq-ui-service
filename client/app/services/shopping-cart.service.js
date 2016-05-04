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
      // an array of items already in the basket
      getItems: function() {
        return CollectionsApi.query('service_orders/cart/service_requests', {
          expand: 'resources',
        })
        .catch(function(err) {
          // 404 means cart doesn't exist yet, we can simply create it
          if (err.status !== 404) {
            return $q.reject(err);
          }

          return CollectionsApi.post('service_orders', null, {}, { state: "cart" })
          .then(function() {
            // we just care it's been successfully created
            return {};
          });
        })
        .then(function(response) {
          return response.resources || [];
        });
      },

      // order the cart
      orderCart: function() {
        return CollectionsApi.post('service_orders', 'cart', null, {
          action: 'order',
        });
      },

      // clear the cart
      clearCart: function() {
        return CollectionsApi.post('service_orders', 'cart', null, {
          action: 'clear',
        });
      },

      // add a thingy to the cart
      addItem: function(request) {
        return CollectionsApi.post('service_orders/cart/service_requests', null, null, {
          action: "add",
          resources: [ request ],
        })
        .then(function(response) {
          // handle failure
          if (response.results[0].success === false) {
            return $q.reject(response.results[0].message);
          }

          return response.results[0];
        });
      },

      // remove a thingy from the cart
      removeItem: function(requestId) {
        return CollectionsApi.post('service_orders/cart/service_requests', null, null, {
          action: "remove",
          resources: [ { id: requestId } ],
        })
        .then(function(response) {
          // handle failure
          if (response.results[0].success === false) {
            return $q.reject(response.results[0].message);
          }

          return response.results[0];
        });
      },
    };

    doReset();

    return service;

    function add(item) {
      return persistence.addItem(item.data)
      .then(function(response) {
        state.items.push({
          id: response.service_request_id,
          description: item.description,
        });
        notify();
      });
    }

    function reload() {
      return persistence.getItems()
      .then(function(items) {
        state = {
          items: items.map(function(o) {
            return lodash.pick(o, ['id', 'description']);
          }),
        };

        notify();
      });
    }

    function doReset() {
      state = {
        items: [],
      };
    }

    function reset() {
      return persistence.clearCart()
      .then(reload);
    }

    function removeItem(item) {
      return persistence.removeItem(item.id)
      .then(function() {
        state.items = lodash.filter(state.items, function(i) {
          return i.id !== item.id;
        });

        notify();
      });
    }

    function submit() {
      return persistence.orderCart()
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

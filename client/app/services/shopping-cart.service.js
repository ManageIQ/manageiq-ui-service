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
        var i = {
          id: response.service_request_id,
          description: item.description,

          // for duplicate detection
          data: dataToData(item.data),
        };

        state.items.push(i);

        dedup();
        notify();

        return i;
      });
    }

    function reload() {
      return persistence.getItems()
      .then(function(items) {
        state = {
          items: items.map(function(o) {
            return {
              id: o.id,
              description: o.description,
              data: optionsToData(o.options),
            };
          }),
        };

        dedup();
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

        dedup();
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

    function dedup() {
      var potential = [];

      state.items.forEach(function(item) {
        if (!item.data) {
          return;
        }

        item.duplicate = [];
        potential.push(item);
      });

      for (var i = 0; i < potential.length - 1; i++) {
        for (var j = i + 1; j < potential.length; j++) {
          var a = potential[i];
          var b = potential[j];

          if (angular.equals(a.data, b.data)) {
            a.duplicate.push(b.id);
            b.duplicate.push(a.id);
          }
        }
      }

      potential.forEach(function(item) {
        if (item.duplicate && !item.duplicate.length) {
          delete item.duplicate;
        }
      });
    }

    // convert options value from the API to the format used when sending - for deduplication across reloads
    function optionsToData(options) {
      var data = { "service_template_href": "/api/service_templates/" + options.src_id };

      lodash.each(options.dialog, function(value, key) {
        data[ key.replace(/^dialog_/, '') ] = value;
      });

      return data;
    }

    // remove falsy fields from data, to achieve compatibility with data received back from the API
    function dataToData(data) {
      data = angular.copy(data);

      lodash.each(data, function(value, key) {
        if (!value) {
          delete data[key];
        }
      });

      return data;
    }
  }
})();

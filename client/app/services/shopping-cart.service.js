(function() {
  'use strict';

  angular.module('app.services')
  .factory('ShoppingCart', ShoppingCartFactory);

  /** @ngInject */
  function ShoppingCartFactory($rootScope, CollectionsApi, $q, $http, lodash) {
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
    };

    var persistence = {
      // FIXME this one is broken, waiting for the API
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

      getItems: function(serviceOrderId) {
        var path = 'service_orders/' + serviceOrderId + '/service_requests';

        return CollectionsApi.query(path, { expand: 'resources' })
        .then(function(response) {
          return response.resources || [];
        });
      },

      removeItem: function(item) {
        return $http.delete(item.href);
      },
      orderItem: function(item) {
        return $http.put(item.href, { process: true });
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
      if (state && state.items) {
        state.items.forEach(persistence.removeItem);
      }

      doReset();
      notify();
    }

    function removeItem(item) {
      persistence.removeItem(item)
      .then(function() {
        state.items = lodash.filter(state.items, function(i) {
          return i !== item;
        });

        notify();
      });
    }

    function submit() {
      return $q.all(state.items.map(persistence.orderItem))
      .then(function() {
        doReset();
        notify();
      });
    }

    function count() {
      return state.items.length;
    }

    function notify() {
      $rootScope.$broadcast('shoppingCartUpdated');
    }
  }
})();

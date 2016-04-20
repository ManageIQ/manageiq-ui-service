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
      state: function() { return state; },
    };

    var persistence = {
      removeItem: function(item) {
        return $http.delete(item.href);
      },
      orderItem: function(item) {
        return $http.put(item.href, { process: true });
      },
    };

    doReset();
    reload();

    return service;

    function add(item) {
      state.items.push(item);
      notify();
    }

    function reload() {
      CollectionsApi.query('service_requests', {
        expand: 'resources',
        filter: [ 'process=false' ],
      })
      .then(function(response) {
        console.log('reload', response);

        state = {
          items: lodash.cloneDeep(response.resources) || [],
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
